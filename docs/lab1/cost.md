# Вартість · Лабораторна 1

Ціни «за прайсом» — з src/models.ts (звірено зі сторінками вендорів 2026-09-27: gemini-3.8-flash — $0.75 / $3.75 за 1M токенів до 2026-12-31, далі $1.50 / $7.50; безкоштовний рівень — «Free of charge»; https://ai.google.dev/gemini-api/docs/pricing — збігається з models.ts, змін не потрібно).
Для безкоштовних рівнів «$ фактично» = 0, а «$ за прайсом» рахуйте за цінами models.ts або сторінки вендора.
Затримка — повний час запиту від відправлення до останнього байта, мс.
Виміри зроблено скриптами scripts/measure-*.ts, не тестами:
npx tsx --env-file=.env.local scripts/measure-cost.ts gemini | ollama | lang docs/lab1/cost.md
Таблиці розділів 1, 2 і 4 мають ті самі 12 колонок, що друкує скрипт: рядки беріть з його виводу.
Ollama: ollama version is 0.34.4 · дата вимірів: 2026-09-27

## 1. Звірка оцінки вхідних токенів (хмарна модель, критерій ≤ 10%)
| прогін | провайдер | модель | вхідні | кешовані | вихідні | оцінка входу до виклику | похибка % | $ фактично | $ за прайсом models.ts | затримка, мс | дата |
|---|---|---|---|---|---|---|---|---|---|---|---|
| gemini-1 | google | gemini-3.8-flash | 15613 | 0 | 739 | 15613 | 0.0 | 0.000000 | 0.014481 | 3695 | 2026-09-27 |
| gemini-2 | google | gemini-3.8-flash | 15613 | 0 | 701 | 15613 | 0.0 | 0.000000 | 0.014339 | 5844 | 2026-09-27 |
| gemini-3 | google | gemini-3.8-flash | 15613 | 8978 | 709 | 15613 | 0.0 | 0.000000 | 0.014368 | 7960 | 2026-09-27 |

Результат: оцінка до виклику збіглася з фактом точно (похибка 0.0% у всіх трьох викликах) — критерій ≤ 10% виконано.
Чим оцінено до виклику: Gemini `countTokens` (той самий systemInstruction і contents) · факт: поле usage `usageMetadata.promptTokenCount`.
Похибка % = |оцінка − факт| / факт × 100.
У Messages-формі факт = input_tokens + cache_read_input_tokens (+ cache_creation_input_tokens).

## 2. Кешування
| прогін | провайдер | модель | вхідні | кешовані | вихідні | оцінка входу до виклику | похибка % | $ фактично | $ за прайсом models.ts | затримка, мс | дата |
|---|---|---|---|---|---|---|---|---|---|---|---|
| gemini-2 (виклик без кешу) | google | gemini-3.8-flash | 15613 | 0 | 701 | 15613 | 0.0 | 0.000000 | 0.014339 | 5844 | 2026-09-27 |
| gemini-3 (виклик із кешем) | google | gemini-3.8-flash | 15613 | 8978 | 709 | 15613 | 0.0 | 0.000000 | 0.014368 | 7960 | 2026-09-27 |
| ollama-1 | ollama | qwen3:4b | 1963 | 0 | 64 | — | — | 0.000000 | 0.000000 | 46761 | 2026-09-27 |
| ollama-2 | ollama | qwen3:4b | 1963 | 1962 | 64 | — | — | 0.000000 | 0.000000 | 501 | 2026-09-27 |

Gemini: форма API — нативний `generateContent`; стабільний префікс — системна інструкція з `scripts/doctor.ts`, `scripts/sync-skills.ts`, `src/models.ts` (15 613 токенів разом із питанням, поріг неявного кешу — 4096).
Назва поля кешу: `usageMetadata.cachedContentTokenCount` · сирий usage виклику з кешем (без тексту відповіді): `{"promptTokenCount":15613,"candidatesTokenCount":83,"totalTokenCount":16322,"cachedContentTokenCount":8978,"promptTokensDetails":[{"modality":"TEXT","tokenCount":15613}],"cacheTokensDetails":[{"modality":"TEXT","tokenCount":8978}],"thoughtsTokenCount":626,"serviceTier":"standard"}`
Неявний кеш не гарантований: перші два однакові виклики — 0 кешованих, третій — 8 978 із 15 613 (57%). «$ за прайсом» — оцінка згори без знижки за кеш (cost.ts її не враховує), тож у виклику з кешем вона не менша.

Ollama 0.34.4, `qwen3:4b`: форма API — Messages (`/v1/messages`); стабільний префікс — перші 6000 символів тієї самої системної інструкції (1963 токени разом із питанням); два однакові запити поспіль.
Назва поля кешу: `usage.cache_read_input_tokens` · сирий usage другого виклику: `{"input_tokens":1,"cache_read_input_tokens":1962,"output_tokens":64}`.
Пастка Messages-форми наживо: `input_tokens` другого виклику — лише 1; повний вхід = 1 + 1962 = 1963 (`fromMessagesUsage`). Затримка 46 761 → 501 мс: перший виклик включає завантаження моделі в пам'ять, другий повторно використовує префікс.
Спершу виміри Ollama падали з `model 'qwen3.5:4b' not found`: у `.env.local` рядок `OLLAMA_MODEL=` із шаблону лишився порожнім, і models.ts узяв модель за замовчуванням; після заповнення — `qwen3:4b`.
Для локальної Ollama: це повторне використання префікса, а не знижка в рахунку.

## 3. Множник «українська / англійська»
| Провайдер | Модель | Текст (про що, скільки слів) | Токени en | Токени ua | ua / en |
|---|---|---|---|---|---|
| google | gemini-3.8-flash | правила мого AGENTS.md, 3 абзаци (164 слова ua / 200 слів en) | 241 | 360 | 1.49 |
| ollama | qwen3:4b | те саме (шаблон чату 11 токенів віднято) | 235 | 537 | 2.29 |

Висновок: той самий зміст українською дорожчий у 1.49 раза в токенізаторі Gemini і в 2.29 раза в токенізаторі локальної qwen3:4b. Множник залежить від токенізатора, тому записано трійку «провайдер · модель · відношення».

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

## Вартість у трасах Langfuse (крок 10)

Langfuse рахує вартість сам за визначенням моделі. Для gemini-3.8-flash визначення в Langfuse вже є, і його ціна збіглася з колонкою «$ за прайсом» models.ts до останнього знака (локальна траса 2026-09-28 11:59, [traces-list.png](traces/traces-list.png)):

| Виклик моделі | Вхідні | Вихідні | За models.ts ($0.75 / $3.75 за 1M) | Langfuse |
|---|---|---|---|---|
| chat gemini-3.8-flash, 11:59:55 | 138 | 173 | 0.0001035 + 0.00064875 = $0.000752 | $0.000752 |
| chat gemini-3.8-flash, 11:59:52 | 50 | 45 | 0.0000375 + 0.00016875 = $0.000206 | $0.000206 |

Для `nvidia/nemotron-3-super-120b-a12b:free` (OpenRouter) визначення не було — вартість «—»; додано власне визначення (Settings → Models, ціни 0 / 0 — модель `:free`), після чого нові траси показують $0.00. Визначення не застосовується заднім числом: траси 12:34–12:35 лишились із «—».
Облік провайдера неточний: в одному виклику OpenRouter/NVIDIA повернув `outputTokens: 293` при `reasoningTokens: 326` → `textTokens: -33`. Токени роздумів провайдер рахує окремо від виходу; для оцінки вартості брати `outputTokens`, а не суму text + reasoning.

## 4. Три прогони (крок 11)
| прогін | провайдер | модель | вхідні | кешовані | вихідні | оцінка входу до виклику | похибка % | $ фактично | $ за прайсом models.ts | затримка, мс | дата |
|---|---|---|---|---|---|---|---|---|---|---|---|
| хмарний провайдер | google | gemini-3.8-flash | … | … | … | — | — | 0 | … | … | … |
| шлюз | openrouter | nvidia/nemotron-3.5-lightning:free | 15728 | 0 | 6128 | — | — | 0 | 0.000000 | 216808 | 2026-09-28 |
| локальна модель | Ollama | qwen3:4b | 1060 | 461 | 6157 | — | — | 0 | 0 | 54017 | 2026-09-28 |

Команда для всіх трьох — `npx tsx --env-file=.env.local scripts/measure-loop.ts <gemini|openrouter|ollama-messages> 1`: той самий системний промпт, та сама задача /api/health, ті самі інструменти `list_files` і `read_file`, ліміт 12 кроків. Оцінку входу до виклику `measure-loop.ts` не рахує — «—».

| прогін | зупинка | кроки | виклики інструментів | session |
|---|---|---|---|---|
| шлюз | max-steps (3 останні відповіді не пройшли схему `Proposal`) | 12 | 9: прочитав `src/health.ts`, `tests/health.test.ts`, `app/api/health/route.ts` | agent-loop-openrouter-2026-09-28T10-06-24-815Z |
| локальна модель | done | 2 | 1: `list_files(.)` | agent-loop-ollama-messages-2026-09-28T10-10-47-896Z |

Хмара: `gemini 1` 2026-09-28 — HTTP 503 «model is currently experiencing high demand» на першому ж кроці; раніше 2026-09-27 — HTTP 429 (5 запитів/хв, потім денний ліміт 20). Рядок дозаповнити, коли Gemini відповідатиме.
Шлюз: `:free`-моделі на OpenRouter 2026-09-28 переважно недоступні — `nemotron-3-super` «Service temporarily overloaded» (HTTP 200 з тілом error; після цього адаптер отримав зрозуміле повідомлення про помилку й тест), `gemma-4-26b` і `qwen3.8-27b` — HTTP 429 спільного пулу постачальника. Прогін зроблено на `nemotron-3.5-lightning:free`. «$ за прайсом» для шлюзу — 0: ціни `:free`-моделі на сторінці OpenRouter нульові, у models.ts шлюзу немає.
Висновок: локальна модель — найдешевша і найшвидша на задачу (0 $, 54 с, 2 кроки), але робила висновок без читання файлів; модель шлюзу читала потрібні файли, та витратила в 15× більше вхідних токенів і 4× більше часу і не вклалась у схему виходу. Безкоштовна хмара (Gemini, OpenRouter `:free`) за два дні була недоступна для циклу частіше, ніж доступна.
