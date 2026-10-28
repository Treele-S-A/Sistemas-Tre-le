# Contexto para IA — Portal Treèle

Leia primeiro o **`ESCOPO.md`** (recursos, lista dos sistemas, como incluir sistema/aviso, pendências, histórico).
Mapa de todos os sistemas: `C:\GitHub\Desenvolvimento\MAPA_SISTEMAS.md`.

## O que é
Página de entrada com todos os sistemas da Treèle: cartões com status ao vivo (online/lento/fora), busca (Ctrl+K),
filtros por área, favoritos, tema claro/escuro, avisos e ajuda (GLPI).

## Onde está
- Produção: **https://treelesistemas.treele.com.br** — Vercel `sistema-centralizador` (time `treele2`); push na
  `main` publica.
- GitHub: `Treele-S-A/Sistemas-Tre-le`, branch `main`.
- Localhost: `npm run dev` → http://localhost:3001 (o `/api/status` local roda pelo plugin em `vite.config.ts`).

## Mapa do código
| Arquivo | Conteúdo |
|---|---|
| `src/data/systemsData.ts` | Sistemas (nome, URL, área, descrição, ícone, ativo/em desenvolvimento) e áreas |
| `src/data/portal.ts` | Cores e nomes curtos das áreas, **ordem** dos cartões, ajuda (GLPI, ramal, e-mail), links úteis |
| `src/data/avisos.ts` | Novidades e avisos (com data de validade) |
| `src/App.tsx` | Página: hero, chips, grid, apoio |
| `src/components/` | `Header` (busca única), `SystemCard`, `SystemIcon` |
| `server/verificarStatus.ts` + `api/status.ts` | Verificação dos sistemas (função da Vercel, cache de 2 min). Imports com `.js` (ESM na Vercel) |
| `public/logos/` | Ícones da Treèle (256 px); originais em `C:\GitHub\Desenvolvimento\logos` |

## Regras
- Sistemas da Treèle primeiro (mesmo em desenvolvimento), depois os de outras empresas (Sienge, Mobuss).
- Sistema em desenvolvimento: `isActive: false`, `url: ''` (sem link, fora do status e da contagem).
- Não inventar contatos nem links: o que estiver vazio em `portal.ts` não aparece.
