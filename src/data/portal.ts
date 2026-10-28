import type { CategoryId } from '../types';

// Cor e nome curto de cada área: a cor vai na faixa do topo do cartão e na etiqueta; o nome curto, nos filtros.
export const AREAS: Partial<Record<CategoryId, { cor: string; curto: string }>> = {
  erp: { cor: '#e0473c', curto: 'ERP & Gestão' },
  obras: { cor: '#f0a33a', curto: 'Canteiro & Obras' },
  engenharia: { cor: '#3aa0d8', curto: 'Engenharia' },
  suprimentos: { cor: '#7cc242', curto: 'Suprimentos' },
  bi: { cor: '#9b7be6', curto: 'Dados e Indicadores' },
  ti: { cor: '#4fc3c9', curto: 'TI' },
  crm: { cor: '#00b8d4', curto: 'Comercial' },
  rh: { cor: '#e91e8c', curto: 'RH' },
};

// Ordem dos cartões: primeiro os sistemas próprios da Treèle (inclusive os em desenvolvimento, como o RH),
// depois os de outras empresas (Sienge, Mobuss). Sistema novo da Treèle entra antes de 'sys_sienge'.
// Favoritos do usuário vêm antes de todos.
export const ORDEM = ['sys_supram', 'sys_dashboard', 'sys_planejamento', 'sys_projetos', 'sys_empreiteiros', 'sys_simulador', 'sys_glpi', 'sys_rh', 'sys_sienge', 'sys_mobuss'];

// Bloco "Precisa de ajuda?". Preencher ramal e e-mail da TI quando definidos; o que estiver vazio não aparece.
export const AJUDA = {
  glpi: 'https://glpi.treele.com.br',
  ramal: '',
  email: '',
};

// Bloco "Links úteis" (manuais, políticas, contatos das obras). Vazio = o bloco não aparece.
export const LINKS_UTEIS: { titulo: string; url: string }[] = [];
