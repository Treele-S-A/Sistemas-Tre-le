// Faixa de avisos do topo. Para publicar um aviso, acrescente um item; para tirar, apague ou passe a data "ate".
// tipo: 'novidade' (verde), 'manutencao' (âmbar) ou 'importante' (vermelho). link é opcional.
export type Aviso = { id: string; tipo: 'novidade' | 'manutencao' | 'importante'; texto: string; link?: string; ate?: string };

export const AVISOS: Aviso[] = [
  {
    id: 'supram-planejamento-2026-10',
    tipo: 'novidade',
    texto: 'Supram: nova aba Planejamento na ficha da obra, com os serviços do Prevision e o calendário das próximas semanas.',
    link: 'https://supram.treele.com.br',
    ate: '2026-11-30',
  },
];
