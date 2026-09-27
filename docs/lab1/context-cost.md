# Ціна контексту і MCP

Базову лінію знято у свіжій сесії, до будь-яких змін.
Модель в усіх трьох знімках — однакова: Claude Code 2.1.278 · Opus 5.5 (вікно 1m токенів).
Для інструментів без /context у колонках «до» і «після» — «не вимірюється»,
а замість числа токенів — розмір відповіді MCP-інструмента в символах за транскриптом сесії.

| інструмент | шар / сервер | до | після | як виміряно | навіщо |
|---|---|---|---|---|---|
| Claude Code | базова лінія, свіжа сесія | 30.2k токенів: system prompt 2.4k, system tools 21.1k, memory files 1.1k (CLAUDE.md + AGENTS.md), skills 5.5k (29 навичок), MCP tools 0 (2 інструменти сервера `ide`, відкладені); конектори claude.ai (Claude Docs, Calendar, Gmail) — відкладені, 0 | — | /context | — |
| Claude Code | context7 після підключення (`claude mcp add --transport http --scope user context7 …`) | 30.2k | 30.2k (Δ 0) | /context у новій сесії | визначення MCP-інструментів відкладені: підключення без виклику контексту не займає |
| Claude Code | context7 після реального виклику | 30.2k | 50.0k (Δ +19.8k): messages 16.5k, MCP tools 1.9k (схеми завантажено через ToolSearch — 44 інструменти), MCP server instructions 0.9k, system tools +0.7k | /context до і після запиту в тій самій сесії | актуальна документація Next.js замість вгаданої: агент знайшов `route.mdx` для v16.2.9 і сам зазначив, що в проєкті 16.3.4 (новішої версії в Context7 немає) |

| Antigravity 1.2.12 · Gemini 3.8 Flash (High) | context7 (`agy mcp add context7 https://mcp.context7.com/mcp` → `~/.gemini/config/mcp_config.json`, поза репозиторієм) | не вимірюється | відповідь: 6 095 символів (resolve-library-id 1 985 + query-docs 4 110) | транскрипт agy: `brain/212a17d2…/.system_generated/steps/5,7/output.txt`; той самий запит | те саме; схеми інструментів agy теж читає на вимогу (`~/.gemini/antigravity-cli/mcp/context7/*.json`) |

Antigravity, рядки журналу (сесія `212a17d2`): [L64–L65](https://github.com/VitaliySysak/AI-lab1/blob/1dc6366878c0cfae40c77cbab24266fe3d18e4e6/.agent-log/antigravity.jsonl#L64-L65) · 18:50:39 · view_file схем; [L66–L67](https://github.com/VitaliySysak/AI-lab1/blob/1dc6366878c0cfae40c77cbab24266fe3d18e4e6/.agent-log/antigravity.jsonl#L66-L67) · 18:50:48–18:51:07 · `call_mcp_tool` (назва сервера й аргументи в події hook не видно).

Claude Code — реальний запит, після якого знято «після»: «Через Context7 знайди в документації Next.js, як в App Router оголосити обробник GET у route.ts» · сесія `1dbfac21` · рядки журналу: [L178](https://github.com/VitaliySysak/AI-lab1/blob/221f712fd3f9cea3058f342ab92620dabc1e4a66/.agent-log/claude-code.jsonl#L178) · 18:45:22 · `mcp__context7__resolve-library-id`; [L180](https://github.com/VitaliySysak/AI-lab1/blob/221f712fd3f9cea3058f342ab92620dabc1e4a66/.agent-log/claude-code.jsonl#L180) · 18:45:29 · `mcp__context7__query-docs`.

Примітки:
- Messages 16.5k включають запит, дві відповіді Context7 і відповідь агента — окремо розмір відповіді сервера /context не показує.
- Аргументи виклику (`libraryId`, `query`) у цих двох рядках не записані: hook журналу ще не знав цих ключів; додано в коміті `221f712`.
- Безпека: сервер у скоупі `user` (`~/.claude.json`), у репозиторії немає ні `.mcp.json`, ні ключа; інструменти дозволено поіменно в `.claude/settings.json` (`mcp__context7__resolve-library-id`, `mcp__context7__query-docs`), а не весь сервер.

Висновок: підключення безкоштовне, а кожен запит до документації коштує ~20k токенів, які лишаються в історії й їдуть у кожен наступний запит сесії. Це дорожче за читання одного файлу, але дешевше за помилку з вигаданим API: на кроках 03–04 обидва агенти впевнено помилялися щодо поведінки Next.js (впевнені помилки №3, №4). Тримати сервер варто для питань про API бібліотек; для питань про цей репозиторій — ні, там дешевше читати файли. Якщо тиждень не викликається — прибрати (`claude mcp remove context7 -s user`).
