# Вартість · Лабораторна 1

Ціни «за прайсом» — з src/models.ts (звірено зі сторінками вендорів 2026-09-27: gemini-3.8-flash — $0.75 / $3.75 за 1M токенів до 2026-12-31, далі $1.50 / $7.50; безкоштовний рівень — «Free of charge»; https://ai.google.dev/gemini-api/docs/pricing — збігається з models.ts, змін не потрібно).
Для безкоштовних рівнів «$ фактично» = 0, а «$ за прайсом» рахуйте за цінами models.ts або сторінки вендора.
Затримка — повний час запиту від відправлення до останнього байта, мс.
Виміри зроблено скриптами scripts/measure-*.ts, не тестами:
npx tsx --env-file=.env.local scripts/measure-cost.ts gemini | ollama | lang docs/lab1/cost.md
Таблиці розділів 1, 2 і 4 мають ті самі 12 колонок, що друкує скрипт: рядки беріть з його виводу.
Ollama: ollama version is 0.34.4 · дата вимірів: …

## 1. Звірка оцінки вхідних токенів (хмарна модель, критерій ≤ 10%)
| прогін | провайдер | модель | вхідні | кешовані | вихідні | оцінка входу до виклику | похибка % | $ фактично | $ за прайсом models.ts | затримка, мс | дата |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |

Чим оцінено до виклику: Gemini `countTokens` (той самий systemInstruction і contents) · факт: поле usage `usageMetadata.promptTokenCount`.
Похибка % = |оцінка − факт| / факт × 100.
У Messages-формі факт = input_tokens + cache_read_input_tokens (+ cache_creation_input_tokens).

## 2. Кешування
| прогін | провайдер | модель | вхідні | кешовані | вихідні | оцінка входу до виклику | похибка % | $ фактично | $ за прайсом models.ts | затримка, мс | дата |
|---|---|---|---|---|---|---|---|---|---|---|---|
| виклик 1 | | | | | | | | | | | |
| виклик 2 | | | | | | | | | | | |

Форма API і довжина стабільного префікса: …
Назва поля кешу: … · сирий usage другого виклику: `{ … }`
Для локальної Ollama: це повторне використання префікса, а не знижка в рахунку.

## 3. Множник «українська / англійська»
| Провайдер | Модель | Текст (про що, скільки слів) | Токени en | Токени ua | ua / en |
|---|---|---|---|---|---|
| | | | | | |

Текст ua — правила мого AGENTS.md (написані мною); текст en — переклад того самого змісту, зроблений Claude Code (помічник), звірений мною.

Тексти, на яких виміряно множник (скрипт читає саме ці два блоки):

```ua
Проєкт для вивчення AI-агентів, написаний на Next.js з власними AI-циклами кодування. Перед тим як звітувати «готово», агент повинен виконати перевірку типів, лінтер, тести і збирання, і всі вони мають бути зеленими. Заборонено змінювати будь-які файли тестів, контракти (схеми чи типи) або конфігурації для вирішення помилки. Дозволено лише тоді, коли людина про це чітко вказала.

Файли із секретами агент не читає і не редагує: секрети веде людина. Тести не ходять у мережу і не викликають платні API. Агент не має права редагувати файл блокування залежностей, теку збирання та конфіги інструментів без прямого наказу. Агент повинен обов'язково зупинитися і запитати підтвердження людини перед масштабним видаленням чи переписуванням наявного коду або файлів, деструктивними операціями в терміналі, відправленням змін у віддалений репозиторій або зміною залежностей.

Модель обирається роллю з реєстру моделей, а не рядком-ідентифікатором. Ціни й дати зняття моделей звіряються зі сторінкою вендора, а не з пам'яті. Повідомлення комітів пишуться за форматом Conventional Commits. Усі створені файли в теці з вихідним кодом повинні мати назви в нотації kebab-case.
```

```en
A project for learning about AI agents, written in Next.js with its own AI coding loops. Before reporting "done", the agent must run the type check, the linter, the tests and the build, and all of them must be green. It is forbidden to change any test files, contracts (schemas or types) or configuration in order to fix an error. This is allowed only when a human has explicitly said so.

The agent does not read or edit files with secrets: secrets are managed by a human. Tests do not go to the network and do not call paid APIs. The agent may not edit the dependency lock file, the build folder or tool configs without a direct instruction. The agent must stop and ask a human for confirmation before large-scale deletion or rewriting of existing code or files, destructive terminal operations, pushing changes to a remote repository, or changing dependencies.

The model is chosen by role from the model registry, not by an identifier string. Model prices and retirement dates are checked against the vendor's page, not from memory. Commit messages follow the Conventional Commits format. All files created in the source code folder must be named in kebab-case.
```

## 4. Три прогони (крок 11)
| прогін | провайдер | модель | вхідні | кешовані | вихідні | оцінка входу до виклику | похибка % | $ фактично | $ за прайсом models.ts | затримка, мс | дата |
|---|---|---|---|---|---|---|---|---|---|---|---|
| хмарний провайдер | | | | | | | | | | | |
| шлюз | | | | | | | | | | | |
| локальна модель | Ollama | | | | | — | — | 0 | 0 | | |
