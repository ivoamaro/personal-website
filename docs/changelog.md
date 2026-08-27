# Changelog

Significant project changes only (architecture, conventions, decisions).

## 2026-08-27

- Cursor rules are tracked in git (`.cursor/rules/`); other `.cursor/` files stay ignored.
- Slimmed `docs/` to architecture + index; dropped planned stub docs.
- Content lives at repo root (`content/`), loaded via `src/content.config.ts`.
