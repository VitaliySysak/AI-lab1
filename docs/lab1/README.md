# Пакет доказів · Лабораторна 1

Автор: <ПІБ>, група <група>

## Інструменти
| Роль | Інструмент | Версія (<інструмент> --version) | План або модель |
|---|---|---|---|
| Агент кодування A | Claude Code | 2.1.278 | Sonnet 5 |
| Агент кодування B | Antigravity CLI (agy) | 1.2.8 → 1.2.12 (оновився сам, з кроку 04) | Google AI Pro · Gemini 3.8 Flash (High) |

## Як запустити у двох інструментах
### Інструмент A
1.
### Інструмент B
1.

## Прогони CI
- Контракт /api/health до реалізації — червоний (падає «Перевірка типів», TS2307): [run 36324776233](https://github.com/VitaliySysak/AI-lab1/actions/runs/36324776233) · коміт `768ecab`
- Зелений прогін на main: [run 36328059801](https://github.com/VitaliySysak/AI-lab1/actions/runs/36328059801) · коміт `10a92e7` (оновити перед поданням)
- Зелений job «Playwright (не блокує)»: <посилання> · копія скріншота: docs/lab1/e2e-<назва-сторінки>.png
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
- Ендпоінт: <URL> · рантайм:
- Система трасування: · скріншоти: docs/lab1/traces/
- Публічні посилання на траси (якщо система їх дає):

## Докази за критеріями
| Критерій | Файл або посилання |
|---|---|
| AGENTS.md ≤ 200 рядків, тест 40% | AGENTS.md · agents-md-40.md |
| Журнал із двох інструментів | .agent-log/claude-code.jsonl, .agent-log/antigravity.jsonl |
| Впевнені помилки | confident-errors.md |
| Навичка, обидва розташування, спрацювання | .claude/skills/<назва>/ · .agents/skills/<назва>/ · skill-trigger.md |
| Заборона: рядок denied | <permalink> |
| MCP і ціна контексту | context-cost.md |
| Оцінка токенів, кеш, ua/en, три прогони | cost.md |
| Власний цикл і тести | src/agent/agent-loop.ts · tests/agent-loop.test.ts |
| Порівняння «та сама задача» | comparison.md |
| SDK і підтвердження дій | src/agent/agent-aisdk.ts · tests/agent-aisdk.test.ts |
| Рішення про модель | model-decision.md |
| Переносність | portability.md |
| Журнал автономності | autonomy-log.md |
| Чернетка «Вступу» | intro-draft.md |
