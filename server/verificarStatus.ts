import { INITIAL_SYSTEMS } from '../src/data/systemsData.js';

// Testa, do servidor, se cada sistema responde. Usado pela função /api/status (Vercel) e pelo
// servidor local de desenvolvimento (vite.config.ts). Não envia credencial nenhuma: só abre a página inicial.
export type SituacaoSistema = 'online' | 'lento' | 'fora';
export type StatusSistema = { id: string; situacao: SituacaoSistema; ms: number | null; http: number | null };
export type RespostaStatus = { verificadoEm: string; sistemas: StatusSistema[] };

const TEMPO_LIMITE_MS = 8000;
const LENTO_MS = 2500;

async function testar(id: string, url: string): Promise<StatusSistema> {
  const inicio = Date.now();
  try {
    const resposta = await fetch(url, {
      method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
      headers: { 'User-Agent': 'PortalTreele-Status/1.0' },
    });
    const ms = Date.now() - inicio;
    // 401/403 também é "no ar": a página respondeu e pediu login.
    const respondeu = resposta.status < 500;
    return { id, ms, http: resposta.status, situacao: !respondeu ? 'fora' : ms > LENTO_MS ? 'lento' : 'online' };
  } catch {
    return { id, ms: null, http: null, situacao: 'fora' };
  }
}

export async function verificarStatus(): Promise<RespostaStatus> {
  // Sistemas em desenvolvimento (sem link) ficam fora da verificação.
  const sistemas = await Promise.all(INITIAL_SYSTEMS.filter((s) => s.isActive && s.url).map((s) => testar(s.id, s.url)));
  return { verificadoEm: new Date().toISOString(), sistemas };
}
