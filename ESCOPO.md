# Portal Treèle — escopo e situação

Portal de acesso aos sistemas da Treèle Construtora. Produção: **https://treelesistemas.treele.com.br**
(projeto `sistema-centralizador` na Vercel, time `treele2`; push na `main` publica). Localhost: `npm run dev` (porta 3001).

## O que o portal faz (28/10/2026)

| Recurso | Situação | Onde mexer |
|---|---|---|
| Catálogo dos sistemas em grid único de 4 colunas, área como etiqueta e faixa colorida no cartão | ✅ | `src/data/systemsData.ts`, `src/data/portal.ts` (cores das áreas) |
| Ordem: sistemas da Treèle primeiro (inclusive em desenvolvimento), depois os de outras empresas; favoritos antes de todos | ✅ | `ORDEM` em `src/data/portal.ts` |
| Status ao vivo (online, lento, fora do ar), verificado no servidor a cada 2 min; "X de Y sistemas online" | ✅ | `server/verificarStatus.ts`, `api/status.ts` (função da Vercel) |
| Sistema em desenvolvimento: cartão sem link, "Em desenvolvimento · Em breve", fora do status e da contagem | ✅ (RH) | `isActive: false` e `url: ''` no sistema |
| Busca única no topo (filtra ao digitar; Ctrl+K foca; Enter abre o primeiro) | ✅ | `src/components/Header.tsx` |
| Filtros em chips: Todos, Favoritos, Fora do ar (só quando houver), áreas; contadores seguem a busca | ✅ | `src/App.tsx` |
| Hero compacto com saudação, novidade e status | ✅ | `src/App.tsx` |
| Novidades e avisos (com data de validade) | ✅ | `src/data/avisos.ts` |
| Precisa de ajuda? (chamado no GLPI; ramal e e-mail da TI quando preenchidos) | 🟡 falta ramal e e-mail | `AJUDA` em `src/data/portal.ts` |
| Links úteis (manuais, políticas, contatos das obras) | 🟡 bloco escondido até ter links | `LINKS_UTEIS` em `src/data/portal.ts` |
| Tema claro e escuro, animações (respeitam "reduzir movimento") | ✅ | `src/index.css`, `src/hooks/usePortal.ts` |

## Sistemas

| Ordem | Sistema | Endereço | Ícone | Situação |
|---:|---|---|---|---|
| 1 | Supram | supram.treele.com.br | símbolo verde | ✅ |
| 2 | Dashboard & Indicadores | dashboard.treele.com.br | símbolo azul | ✅ |
| 3 | Planejamento de Obras | planejamento.treele.com.br | símbolo vermelho | ✅ |
| 4 | Portal de Projetos | projetos.treele.com.br | símbolo amarelo | ✅ |
| 5 | Gestão de Empreiteiros | gestaoempreiteiros.treele.com.br | símbolo marrom | ✅ |
| 6 | Simulador de Empreendimentos | simulador.treele.com.br | símbolo ciano | ✅ |
| 7 | GLPI – Central de TI | glpi.treele.com.br | logo do GLPI | ✅ |
| 8 | Sistema de RH | — | símbolo rosa | 🔧 em desenvolvimento |
| 9 | Sienge Plataforma | treele.sienge.com.br | logo do Sienge | ✅ (terceiro) |
| 10 | Mobuss Construção | mobuss.com.br | logo do Mobuss | ✅ (terceiro) |

Ícones da Treèle: `public/logos/<sistema>.png` (256 px). Originais em 1024 px, um por pasta, em
`C:\GitHub\Desenvolvimento\logos` (fora do repositório). Os símbolos verde e azul foram enviados pelo usuário; os
demais saem deles trocando só a cor.

## Como fazer

- **Sistema novo:** acrescentar em `INITIAL_SYSTEMS` (`systemsData.ts`), colocar o id em `ORDEM` (da Treèle: antes
  de `sys_sienge`) e o ícone em `public/logos/`. Área nova: `SYSTEM_CATEGORIES` + `AREAS`.
- **Sistema em desenvolvimento ficou pronto:** preencher `url` e `domain` e mudar `isActive` para `true`.
- **Aviso:** acrescentar em `AVISOS` (`avisos.ts`) com `ate` (AAAA-MM-DD) para sair sozinho.

## Pendências

- Ramal e e-mail da TI para o bloco "Precisa de ajuda?".
- Links úteis (manuais, políticas, contatos das obras).
- Logos com nome (marca horizontal) de cada sistema: aguardando a logo oficial da Treèle em vetor (SVG/AI/PDF).
- Descrição e link do Sistema de RH quando ficar pronto.

## Histórico

- 15/10/2026: catálogo inicial (Central de serviços).
- 28/10/2026: repaginado como **Portal Treèle** (status ao vivo, tema claro/escuro, animações, Ctrl+K). No mesmo dia,
  ajustes do relatório de teste no navegador: grid único, hero compacto, chips, busca única, botão "Ajuda" (o ícone
  antigo parecia engrenagem de configuração), cartões compactos, ícones da Treèle por cor, Simulador e RH. Animação da troca de filtro suavizada; área BI renomeada para Dados e Indicadores.
