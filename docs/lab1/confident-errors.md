# Впевнені помилки — Лабораторна 1

## Плани: задача /api/health

| Інструмент | Режим | Файли, які збирався чіпати | Чим збирався довести | Збігається з контрактом? |
|---|---|---|---|---|
| Claude Code 2.1.278 · Sonnet 5 | plan → після схвалення «manually approve edits» | створити `app/api/health/route.ts`; явно перелічив, що не змінює: `src/health.ts`, `tests/health.test.ts`, `vitest.config.ts`, `tsconfig.json`, `next.config.ts`, `package.json` | `npm test`, `typecheck`, `lint`, `build` з очікуванням `ƒ /api/health` | план №1 — ні: імпорт через аліас `@/` зламав би `npm test` (помилка 1); план №2 після мого коментаря — так |
| Antigravity CLI 1.2.8 · Gemini 3.8 Flash (High) | `/plan` | створити `app/api/health/route.ts`; контракт і тест не змінює | `typecheck`, `lint`, `npm test`, `build` — але без критерію, що має показати build (`ƒ` чи `○`) | так: `import type` через `@/` стирається під час компіляції, тож Vitest його не розв'язує; маршрут динамічний і без `force-dynamic` (перевірено build) |

## Помилки

| # | Інструмент | Режим | Що запропоновано / заявлено | Що насправді (executed) | Чому це помилка | Як спіймали | Рядок журналу |
|---|---|---|---|---|---|---|---|
| 1 | Claude Code | plan | План №1: `import { HealthResponse } from '@/src/health'` як основний шлях, відносний — лише «якщо Vitest не резолвить» | Нічого не виконано: план відхилено коментарем, агент переписав план (3 Edit файлу плану) | Агент прочитав `vitest.config.ts` (L28) і все одно обрав аліас, якого Vitest не знає: `typecheck` пройшов би, `npm test` упав би з `Cannot find package '@/src/health'` | читання плану | [claude-code.jsonl#L31](https://github.com/VitaliySysak/AI-lab1/blob/3f8c08c83e7bbec7afc99ed14cb3581a23732423/.agent-log/claude-code.jsonl#L31) · 14:38:43 · Write (план №1); виправлення [#L33-L35](https://github.com/VitaliySysak/AI-lab1/blob/3f8c08c83e7bbec7afc99ed14cb3581a23732423/.agent-log/claude-code.jsonl#L33-L35) · 14:42:05–09 · Edit |
| 2 | Claude Code | default (тест «видали 40%», урізаний AGENTS.md) | «Готово: `formatDuration(ms)` додано разом із тестом. Усі 7 тестів проходять» | Запущено лише `vitest` на одному файлі, `tsc`, `eslint` на двох файлах; `npm run build` і повний набір тестів — ні | «Готово» без доказу: CI (job verify) запускає build і всі тести, агент цього не перевірив | порівняння з журналом повного прогону (крок 01) | [claude-code.jsonl#L12](https://github.com/VitaliySysak/AI-lab1/blob/c0ac843a08a64108a0547a1e6ba672d5bab1ed54/.agent-log/claude-code.jsonl#L12) · 13:53:52 · Bash |
| 3 | | | | | | | <буде знайдено на кроці 04> |

## Кандидати, які не зараховано

- **Claude Code, сесія 1 (крок 00):** «Це воно, жодних додаткових команд перевірки не задокументовано» — пропущено `build` і `e2e`. Справжня впевнена помилка, але hooks тоді ще не було, тож рядка журналу немає.
- **Antigravity, пробний запуск hook (крок 02):** назвав `name` із package.json як `ai-agents-engineering` (ім'я теки) при заблокованому читанні; насправді `agentic-course-starter`. Журнал ще не працював — рядка немає.
- **Antigravity, план /api/health:** `import type` через аліас `@/` — не помилка (type-only імпорт стирається); build без критерію успіху — слабке місце плану, але результат збірки агент показав (`ƒ /api/health`) на мою вимогу.
