# CLAUDE.md — Analitico KLA

## Prevenção de API Stream Idle Timeout

**Regra obrigatória:** Qualquer comando Bash que demore mais de ~30s DEVE usar `run_in_background: true`.

Comandos que exigem background obrigatório:
- `npm run build`
- `npm run test:coverage`
- `npm ci` / `npm install`
- `npx vitest run` (suite completa)
- `git push`

Comandos rápidos que NÃO precisam de background:
- `git status`, `git add`, `git commit`, `git log`
- `npm run lint`
- `npx vitest run src/__tests__/arquivo-especifico.test.tsx`
- `ls`, `find`, `grep`

## Branch de desenvolvimento

Sempre desenvolver em `claude/analyze-project-roadmap-BCadU` salvo instrução explícita de subir para `main`.

## Stack

React 18 + TypeScript + Vite + Tailwind + Zustand + Vitest + ESLint v9
