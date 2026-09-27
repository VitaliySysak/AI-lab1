// Hook журналу дій агента: читає JSON події зі stdin і дописує
// один рядок формату курсу в .agent-log/<source>.jsonl.
// Виклик: node scripts/agent-log-hook.mjs <source> [result]
//   Claude Code: події PostToolUse (ok) і PostToolUseFailure (error).
//   Antigravity: подія PostToolUse; спрацьовує лише після успішного виклику,
//   поле error при цьому порожнє (перевірено на agy 1.2.8).
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [source = 'unknown', resultArg = 'ok'] = process.argv.slice(2);

try {
  const event = JSON.parse(readFileSync(0, 'utf8'));

  // Claude Code: snake_case (tool_name, tool_input);
  // Antigravity: toolCall.name, toolCall.args, conversationId.
  const tool = event.tool_name ?? event.toolCall?.name ?? 'unknown';
  let args = event.tool_input ?? event.toolCall?.args ?? {};
  if (typeof args === 'string') {
    try {
      args = JSON.parse(args);
    } catch {
      args = {};
    }
  }

  // Лише шлях, команда чи шаблон — ніколи вміст файлу.
  // Antigravity: CodeContent, ReplacementContent тощо сюди навмисно не входять.
  const KEYS = [
    'file_path', 'path', 'command', 'pattern', 'url', 'skill',
    'AbsolutePath', 'TargetFile', 'DirectoryPath', 'SearchPath', 'SearchDirectory',
    'CommandLine', 'Query', 'Pattern', 'Url',
  ];
  const input = {};
  for (const key of KEYS) {
    if (typeof args[key] === 'string') input[key] = args[key].slice(0, 200);
  }

  // Antigravity передає помилку в полі error (порожній рядок — успіх).
  const result = typeof event.error === 'string' && event.error !== '' ? 'error' : resultArg;
  const session = event.session_id ?? event.conversationId ?? 'unknown';

  // Antigravity запускає hook з теки .agents/, тому корінь беремо з події.
  const root = process.env.CLAUDE_PROJECT_DIR ?? event.workspacePaths?.[0] ?? process.cwd();
  const dir = join(root, '.agent-log');
  mkdirSync(dir, { recursive: true });
  const row = { ts: new Date().toISOString(), tool, input, result, session, source };
  appendFileSync(join(dir, `${source}.jsonl`), `${JSON.stringify(row)}\n`);
} catch (err) {
  // Журнал не має ламати роботу агента: повідомляємо в stderr і йдемо далі.
  console.error(`agent-log-hook: ${err.message}`);
}

// Antigravity чекає JSON-об'єкт у stdout PostToolUse.
if (source === 'antigravity') process.stdout.write('{}');
