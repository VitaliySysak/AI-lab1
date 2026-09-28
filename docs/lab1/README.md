# Пакет доказів · Лабораторна 1

Автор: Сисак Віталій Романович, група 4cs-43

## Інструменти
| Роль | Інструмент | Версія (<інструмент> --version) | План або модель |
|---|---|---|---|
| Агент кодування A | Claude Code | 2.1.278 (усі сесії лабораторної) → 2.1.283 (оновився сам, на момент подання) | Sonnet 5 у контрольних сесіях; Opus 5.5 — сесія-помічник і вимір /context |
| Агент кодування B | Antigravity CLI (agy) | 1.2.8 → 1.2.12 (оновився сам, з кроку 04) | Google AI Pro · Gemini 3.8 Flash (High) |
| Власний цикл | `src/agent/agent-loop.ts` (крок 08), `src/agent/agent-aisdk.ts` (крок 09) | AI SDK `ai@7.0.118` | qwen3:4b (Ollama 0.34.4), gemini-3.8-flash, OpenRouter `:free` |

## Як запустити у двох інструментах
Спільне для обох (Git Bash, з кореня репозиторію):
1. `npm install`, потім `npm run doctor` — Node ≥ 22.12 і git мають бути OK.
2. `cp .env.example .env.local` і вписати свої ключі — файл не комітиться, агенти його не читають (правило AGENTS.md + заборона).
3. `npm run sync-skills -- --check` — копія навички в `.agents/skills/` актуальна.
4. Перевірки перед «готово» (AGENTS.md): `npm run typecheck && npm run lint && npm test && npm run build`.

### Інструмент A — Claude Code
1. `claude --permission-mode default` у корені репозиторію (на плані Pro/Max сесія інакше стартує в auto). Правила — з `CLAUDE.md` → `@AGENTS.md`.
2. Журнал і заборона підхоплюються самі з `.claude/settings.json`: `PostToolUse`/`PostToolUseFailure` → `scripts/agent-log-hook.mjs` → `.agent-log/claude-code.jsonl`; `PreToolUse` (`Bash|PowerShell|Write|Edit|MultiEdit|Read|Grep`) → `scripts/guard-env.mjs`. Перевірка — `/hooks`.
3. Навичка — `.claude/skills/add-api-route/`, перевірка `/skills`; режим плану — Shift+Tab або `claude --permission-mode plan`.
4. MCP Context7 (скоуп user, поза репозиторієм): `claude mcp add --transport http --scope user context7 https://mcp.context7.com/mcp`, перевірка `/mcp`.

### Інструмент B — Antigravity CLI
1. `agy` у корені репозиторію, підтвердити довіру до теки. Правила — з `AGENTS.md` напряму.
2. Журнал і заборона — `.agents/hooks.json`: `PostToolUse` → `scripts/agent-log-hook.mjs antigravity` → `.agent-log/antigravity.jsonl`; `PreToolUse` → `scripts/guard-env.mjs antigravity`. Hooks стартують у теці `.agents/`, тому шляхи `../scripts/…`.
3. Навичка — лише з `.agents/skills/add-api-route/` (копія після `npm run sync-skills`); режим плану — `agy --mode=plan` або `/plan`.
4. MCP Context7: `agy mcp add context7 https://mcp.context7.com/mcp` (запис у `~/.gemini/config/mcp_config.json`, поза репозиторієм), перевірка `agy mcp list`.
5. Обмеження: журнал agy записує `ok` для команд з ненульовим кодом виходу, невдалі виклики інструментів не потрапляють у журнал (portability.md).

## Прогони CI
- Контракт /api/health до реалізації — червоний (падає «Перевірка типів», TS2307): [run 36324776233](https://github.com/VitaliySysak/AI-lab1/actions/runs/36324776233) · коміт `768ecab`
- Зелений прогін на main: [run 36408642664](https://github.com/VitaliySysak/AI-lab1/actions/runs/36408642664) · коміт `2b76f3f` (оновити на останній коміт перед поданням)
- Тести власного циклу (крок 08) зелені в CI: [run 36344715530](https://github.com/VitaliySysak/AI-lab1/actions/runs/36344715530) · коміт `69558a7`
- Тест підтвердження AI SDK (крок 09) зелений у CI: [run 36398793934](https://github.com/VitaliySysak/AI-lab1/actions/runs/36398793934) · коміт `6fb7ae5`
- Гілка `lab1/health-loop` — червоний CI навмисно: застосована пропозиція власного циклу не проходить `health.test.ts` (1/3), це доказ для comparison.md: [run 36348617645](https://github.com/VitaliySysak/AI-lab1/actions/runs/36348617645)
- Зелений job «Playwright (не блокує)», крок «E2E-тести» — success: [job 108686887652](https://github.com/VitaliySysak/AI-lab1/actions/runs/36343066555/job/108686887652) (прогін 36343066555, коміт `bcf580d`) · копія скріншота з артефакту `playwright-artifacts`: [docs/lab1/e2e-home.png](e2e-home.png)
- Червоний прогін «поганого патча»: <посилання на PR і прогін> · яка перевірка спрацювала:

## Тест «видали 40%»
- lab1/agents-md-40-full: [гілка](https://github.com/VitaliySysak/AI-lab1/tree/lab1/agents-md-40-full) · [прогін CI](https://github.com/VitaliySysak/AI-lab1/actions/runs/36323820633)
- lab1/agents-md-40-cut: [гілка](https://github.com/VitaliySysak/AI-lab1/tree/lab1/agents-md-40-cut) · [прогін CI](https://github.com/VitaliySysak/AI-lab1/actions/runs/36324052175)

## Та сама задача в двох інструментах
- Базовий коміт (контракт і червоний тест): `768ecab` · [червоний CI](https://github.com/VitaliySysak/AI-lab1/actions/runs/36324776233)
- lab1/health-claude-code: [гілка](https://github.com/VitaliySysak/AI-lab1/tree/lab1/health-claude-code) · [порівняння з базовим комітом](https://github.com/VitaliySysak/AI-lab1/compare/768ecab...lab1/health-claude-code) · [зелений CI](https://github.com/VitaliySysak/AI-lab1/actions/runs/36327086206)
- lab1/health-antigravity: [гілка](https://github.com/VitaliySysak/AI-lab1/tree/lab1/health-antigravity) · [порівняння з базовим комітом](https://github.com/VitaliySysak/AI-lab1/compare/768ecab...lab1/health-antigravity) · [зелений CI](https://github.com/VitaliySysak/AI-lab1/actions/runs/36327889943)
- У main злито: lab1/health-claude-code, коміт `f816e2e`

## Деплой і траси
- Ендпоінт: `POST https://ai-lab1-sage.vercel.app/api/agent` · рантайм: Vercel Hobby, Node.js (Next.js 16 App Router), `maxDuration = 60`
- Модель: OpenRouter `:free` (id у змінній `OPENROUTER_MODEL`, зараз `nvidia/nemotron-3-super-120b-a12b:free`), `maxRetries: 0`, ліміт 3 кроки, інструмент `getTime`. Спершу був Gemini free tier — замінено через денний ліміт 20 запитів і 503 (див. autonomy-log.md)
- Система трасування: Langfuse Cloud Hobby (OpenTelemetry + `@langfuse/vercel-ai-sdk`, `functionId: lab01-agent`) · скріншоти: [docs/lab1/traces/](traces/)
- Знімки: [traces-list.png](traces/traces-list.png) — виклики моделі з токенами й вартістю; [trace-1.png](traces/trace-1.png), [trace-2.png](traces/trace-2.png), [trace-3.png](traces/trace-3.png) — три траси з деплою (2026-09-28 12:44:55, 12:45:09, 12:45:52): дерево кроків, `getTime`, токени, $0.00; [trace-1-attributes.png](traces/trace-1-attributes.png) — `gen_ai.agent.name = lab01-agent`, провайдер `openrouter`, модель
- Публічні посилання на траси (якщо система їх дає): …
- Команда виклику (Git Bash):

```bash
printf '{"prompt":"%s"}' 'Котра зараз година?' | curl -s -X POST https://ai-lab1-sage.vercel.app/api/agent -H 'Content-Type: application/json; charset=utf-8' --data-binary @-
```

## Докази за критеріями
| Критерій | Файл або посилання |
|---|---|
| AGENTS.md ≤ 200 рядків, тест 40% | [AGENTS.md](../../AGENTS.md) · [CLAUDE.md](../../CLAUDE.md) (`@AGENTS.md`) · [agents-md-40.md](agents-md-40.md) |
| Журнал із двох інструментів | [.agent-log/claude-code.jsonl](../../.agent-log/claude-code.jsonl), [.agent-log/antigravity.jsonl](../../.agent-log/antigravity.jsonl), [.agent-log/agent-loop.jsonl](../../.agent-log/agent-loop.jsonl) · налаштування: [.claude/settings.json](../../.claude/settings.json), [.agents/hooks.json](../../.agents/hooks.json), [scripts/agent-log-hook.mjs](../../scripts/agent-log-hook.mjs) |
| Впевнені помилки | [confident-errors.md](confident-errors.md) |
| Навичка, обидва розташування, спрацювання | [.claude/skills/add-api-route/](../../.claude/skills/add-api-route/) · [.agents/skills/add-api-route/](../../.agents/skills/add-api-route/) · [skill-trigger.md](skill-trigger.md) |
| Заборона: рядок denied | [claude-code.jsonl#L169-L172](https://github.com/VitaliySysak/AI-lab1/blob/fb5f730791f32e512b24d24dda0daa72a7ff326a/.agent-log/claude-code.jsonl#L169-L172) · [scripts/guard-env.mjs](../../scripts/guard-env.mjs) |
| MCP і ціна контексту | [context-cost.md](context-cost.md) |
| Скріншот-тест | [tests/health-link.spec.ts](../../tests/health-link.spec.ts) · [e2e-home.png](e2e-home.png) |
| Оцінка токенів, кеш, ua/en, три прогони | [cost.md](cost.md) · [src/cost.ts](../../src/cost.ts) · [scripts/measure-cost.ts](../../scripts/measure-cost.ts) |
| Власний цикл і тести | [src/agent/agent-loop.ts](../../src/agent/agent-loop.ts) · [src/agent/tools.ts](../../src/agent/tools.ts) · [src/agent/adapters.ts](../../src/agent/adapters.ts) · [tests/agent-loop.test.ts](../../tests/agent-loop.test.ts) · [scripts/measure-loop.ts](../../scripts/measure-loop.ts) |
| Порівняння «та сама задача» | [comparison.md](comparison.md) |
| SDK і підтвердження дій | [src/agent/agent-aisdk.ts](../../src/agent/agent-aisdk.ts) · [tests/agent-aisdk.test.ts](../../tests/agent-aisdk.test.ts) |
| Деплой і траси | [app/api/agent/route.ts](../../app/api/agent/route.ts) · [traces/](traces/) |
| Рішення про модель | [model-decision.md](model-decision.md) |
| Переносність | [portability.md](portability.md) |
| Журнал автономності | [autonomy-log.md](autonomy-log.md) |
| Чернетка «Вступу» | [intro-draft.md](intro-draft.md) |

## Що ще не завершено (на момент останнього оновлення)
- Рядок «хмара» в [cost.md](cost.md) (розділ 4) і в [comparison.md](comparison.md), ручний запуск SDK-агента на Gemini — Gemini free tier повертав 503/429; повторити, коли відповідатиме.
- Червоний прогін «поганого патча» — чекаю пул-реквест від викладача.
