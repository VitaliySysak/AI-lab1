// PreToolUse-hook: не дає агенту читати чи змінювати .env-файли і САМ пише рядок
// "result":"denied" у журнал — PostToolUse на заблокований виклик не спрацьовує.
// Виклик: node scripts/guard-env.mjs <source>
//   Claude Code: відмова — stderr + код виходу 2.
//   Antigravity: відмова — {"decision":"deny"} у stdout; дозвіл — ПОРОЖНІЙ вивід
//   (порожній об'єкт {} agy сприймає як відмову).
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [source = 'unknown'] = process.argv.slice(2);
const REASON = 'Політика курсу: файли .env читає і змінює людина, не агент. Зупинись і спитай людину.';

// .env, .env.local, .env.production, .env.development.local…, але не .env.example і не process.env.X.
// Без урахування регістру: на Windows .ENV — той самий файл.
const ENV_FILE = /(^|[^A-Za-z0-9_$])\.env(\.(local|development|production|test)(\.local)?)?([^.A-Za-z0-9_]|$)/i;

// Команда або шлях — усе, чим інструмент може дістатися файлу. Вміст файлу не беремо.
// Шаблон пошуку (pattern) навмисно не перевіряємо: пошук тексту «.env» у коді — не доступ до файлу.
const TARGET_KEYS = [
  'command', 'file_path', 'path',
  'CommandLine', 'TargetFile', 'AbsolutePath', 'DirectoryPath', 'SearchPath',
];

let event;
try {
  event = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // Незрозуміла подія — не наша справа, рішення лишається за інструментом.
}

const tool = event.tool_name ?? event.toolCall?.name ?? 'unknown';
const args = event.tool_input ?? event.toolCall?.args ?? {};
const hit = TARGET_KEYS.find((key) => typeof args[key] === 'string' && ENV_FILE.test(args[key]));
if (!hit) process.exit(0);

// Значення після «=» маскуємо: спроба echo KEY=sk-… >> .env не має публікувати ключ.
const shown = args[hit].replace(/=[^\s'"]+/g, '=***').slice(0, 200);
const row = {
  ts: new Date().toISOString(),
  tool,
  input: { [hit]: shown },
  result: 'denied',
  session: event.session_id ?? event.conversationId ?? 'unknown',
  source,
};
try {
  // `||`, а не `??`: порожня змінна середовища означає «не задано».
  const root = process.env.CLAUDE_PROJECT_DIR || event.workspacePaths?.[0] || process.cwd();
  mkdirSync(join(root, '.agent-log'), { recursive: true });
  appendFileSync(join(root, '.agent-log', `${source}.jsonl`), `${JSON.stringify(row)}\n`);
} catch (err) {
  console.error(`guard-env: не вдалося записати журнал: ${err.message}`);
}

if (source === 'antigravity') {
  process.stdout.write(JSON.stringify({ decision: 'deny', reason: REASON }));
  process.exit(0);
}
console.error(REASON);
process.exit(2);
