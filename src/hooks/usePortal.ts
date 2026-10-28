import { useCallback, useEffect, useState } from 'react';
import type { RespostaStatus, StatusSistema } from '../../server/verificarStatus';

// Lista guardada neste navegador (favoritos, recentes). O armazenamento pode falhar (aba anônima): segue sem salvar.
export function useListaLocal(chave: string, validos: string[]) {
  const [lista, setLista] = useState<string[]>(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(chave) || '[]');
      return Array.isArray(salvo) ? salvo.filter((id) => typeof id === 'string' && validos.includes(id)) : [];
    } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem(chave, JSON.stringify(lista)); } catch { /* sem armazenamento */ } }, [chave, lista]);
  return [lista, setLista] as const;
}

export type Tema = 'claro' | 'escuro';

export function useTema() {
  const [tema, setTema] = useState<Tema>(() => {
    try {
      const salvo = localStorage.getItem('treele:tema');
      if (salvo === 'claro' || salvo === 'escuro') return salvo;
    } catch { /* sem armazenamento */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = tema === 'escuro' ? 'dark' : 'light';
    try { localStorage.setItem('treele:tema', tema); } catch { /* sem armazenamento */ }
  }, [tema]);
  const alternar = useCallback(() => setTema((atual) => (atual === 'escuro' ? 'claro' : 'escuro')), []);
  return { tema, alternar };
}

const INTERVALO_MS = 120_000;

// Status ao vivo (/api/status), relido a cada 2 minutos enquanto a aba estiver aberta.
export function useStatus() {
  const [status, setStatus] = useState<Map<string, StatusSistema> | null>(null);
  const [verificadoEm, setVerificadoEm] = useState<string | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        const resposta = await fetch('/api/status', { cache: 'no-store' });
        if (!resposta.ok) throw new Error(String(resposta.status));
        const corpo = await resposta.json() as RespostaStatus;
        if (!ativo) return;
        setStatus(new Map(corpo.sistemas.map((s) => [s.id, s])));
        setVerificadoEm(corpo.verificadoEm);
        setFalhou(false);
      } catch {
        if (ativo) setFalhou(true);
      }
    };
    void carregar();
    const timer = window.setInterval(carregar, INTERVALO_MS);
    return () => { ativo = false; window.clearInterval(timer); };
  }, []);

  return { status, verificadoEm, falhou };
}

// "há 2 min", recalculado a cada 30 s.
export function useHaQuanto(iso: string | null) {
  const [agora, setAgora] = useState(Date.now());
  useEffect(() => { const t = window.setInterval(() => setAgora(Date.now()), 30_000); return () => window.clearInterval(t); }, []);
  if (!iso) return null;
  const minutos = Math.max(0, Math.round((agora - Date.parse(iso)) / 60_000));
  return minutos === 0 ? 'agora' : `há ${minutos} min`;
}
