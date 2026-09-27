# Тест на спрацювання навички `add-api-route`

Інструмент 1 = Claude Code 2.1.278, Sonnet 5 · інструмент 2 = Antigravity CLI (agy) 1.2.12, Gemini 3.8 Flash (High)
Опис (description) на момент тесту: "Додає новий ендпоінт (API-маршрут) у app/api цього Next.js-проєкту: спершу zod-схема відповіді в src/, потім тест Vitest у tests/, потім обробник route.ts. Використовуй, коли просять додати або створити ендпоінт, API-маршрут, route handler чи обробник HTTP-запиту (GET, POST тощо) у app/api. Не використовуй для сторінок, компонентів, стилів, для змін уже наявного маршруту без нового ендпоінта і для функцій у src/ без HTTP."
Назву навички в запитах не згадуйте. П — має викликати, Н — схожий, але не має.
Кожен запит — нова сесія. Зупинка — щойно видно, взяв агент навичку чи почав без неї.
Журнали — коміт `e6fa171`: [claude-code.jsonl](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/claude-code.jsonl), [antigravity.jsonl](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl).

| # | запит (без назви навички) | очікую | інструмент 1: сталося | доказ (ts · tool) | інструмент 2: сталося | доказ (ts · tool) |
|---|---|---|---|---|---|---|
| П1 | Додай ендпоінт GET /api/version, який повертає версію застосунку з package.json | бере | бере ¹ | [L78](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/claude-code.jsonl#L78) · 15:20:23 · Skill | бере | [L8](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L8) · 15:52:12 · view_file SKILL.md |
| П2 | Потрібен новий API-маршрут /api/time, що віддає поточний час сервера в JSON | бере | бере ² | [L94](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/claude-code.jsonl#L94) · 15:31:41 · Skill | бере | [L34](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L34) · 16:11:59 · view_file SKILL.md |
| П3 | Створи обробник POST /api/echo, який повертає назад отримане JSON-тіло | бере | бере | [L105](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/claude-code.jsonl#L105) · 15:35:27 · Skill | бере | [L35](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L35) · 16:15:38 · view_file SKILL.md |
| Н1 | Додай на головну сторінку посилання «Стан сервісу», що веде на /api/health | не бере | не бере | [L118–L121](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/claude-code.jsonl#L118-L121) · 15:38:34–15:39:00 · Glob, Read, Grep, Edit page.tsx | не бере | [L37–L42](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L37-L42) · 16:16:54–16:17:44 · run_command, view_file page.tsx |
| Н2 | Поясни, як працює наявний маршрут /api/health і чому він динамічний | не бере | не бере | [L125–L131](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/claude-code.jsonl#L125-L131) · 15:41:18–15:42:02 · Glob, Read, Grep, PowerShell | не бере | [L43–L46](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L43-L46) · 16:19:10–16:19:32 · view_file, run_command |
| Н3 | Додай у src/ функцію isValidIsoDate(value) з тестом | не бере | не бере | [L133–L138](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/claude-code.jsonl#L133-L138) · 15:43:07–15:43:51 · Bash, Write, Edit | не бере — **недійсно** ³ | [L47–L63](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L47-L63) · 16:22:16–16:26:35 · view_file, run_command |

Доказ: у Claude Code — рядок журналу з tool = Skill; в Antigravity — читання `.agents/skills/add-api-route/SKILL.md` (view_file).

¹ Сесія йшла в режимі auto (Claude Code стартує в ньому на плані Pro): агент виконав задачу без підтверджень. Навичку викликано першою дією, тож результат тесту дійсний; режим зафіксовано в журналі автономності.
² Перша спроба П2 була дана в тій самій сесії, що й П1 (`2af0a5dc`, L82–L88): навичка вже була в контексті — не зараховано, повторено в новій сесії `e5cef60f`. Сесія `389ca490` (L90) — перерваний запуск.
³ Агент прочитав `docs/lab1/skill-trigger.md` ([L58](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L58), 16:24:46) і в міркуваннях назвав запит «негативним тестом», потім шукав `isValidIsoDate` у журналах іншого інструмента (`git grep … .agent-log`, [L63](https://github.com/VitaliySysak/AI-lab1/blob/e6fa171537e713595c5398e3c20825e1748f24ea/.agent-log/antigravity.jsonl#L63)). «Не бере» тут не доводить, що опис відсіює запит: очікування агент прочитав у репозиторії.

Підсумок: Claude Code — 6/6; Antigravity — 5/5 дійсних (Н3 недійсний).

## Що змінили в description після тесту
- Нічого: хибних спрацювань і пропусків немає. Опис не змінювався, повторний тест не потрібен.
- Висновок для методики: тестові матеріали (таблиця очікувань, журнали інших сесій) лежать у репозиторії й видимі агентові. Для чистого повтору Н3 їх треба прибирати з робочої теки на час сесії.
