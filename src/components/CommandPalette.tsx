import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { EnterpriseSystem } from '../types';
import type { StatusSistema } from '../../server/verificarStatus';
import { SystemIcon } from './SystemIcon';
import { StatusPill } from './SystemCard';

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Busca rápida (Ctrl+K): digite e Enter abre o sistema em nova aba. */
export function CommandPalette({ aberto, onFechar, sistemas, status, onAbrir }: {
  aberto: boolean; onFechar: () => void; sistemas: EnterpriseSystem[];
  status: Map<string, StatusSistema> | null; onAbrir: (id: string) => void;
}) {
  const [termo, setTermo] = useState('');
  const [ativo, setAtivo] = useState(0);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => { if (aberto) { setTermo(''); setAtivo(0); setTimeout(() => campo.current?.focus(), 30); } }, [aberto]);

  const resultados = useMemo(() => {
    const t = normalizar(termo.trim());
    return sistemas.filter((s) => !t || normalizar([s.name, s.shortCode, s.description, s.domain, ...s.tags].join(' ')).includes(t));
  }, [termo, sistemas]);

  const abrir = (sistema: EnterpriseSystem | undefined) => {
    if (!sistema) return;
    onAbrir(sistema.id);
    window.open(sistema.url, '_blank', 'noopener,noreferrer');
    onFechar();
  };

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="palette-backdrop" onClick={onFechar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="palette" role="dialog" aria-modal="true" aria-label="Buscar sistema" onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18 }}>
            <div className="palette-search">
              <Search size={18} />
              <input ref={campo} value={termo} placeholder="Qual sistema você procura?" aria-label="Buscar sistema"
                onChange={(e) => { setTermo(e.target.value); setAtivo(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setAtivo((i) => Math.min(i + 1, resultados.length - 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setAtivo((i) => Math.max(i - 1, 0)); }
                  if (e.key === 'Enter') abrir(resultados[ativo]);
                  if (e.key === 'Escape') onFechar();
                }} />
              <kbd>Esc</kbd>
            </div>
            <ul className="palette-list" role="listbox">
              {resultados.map((s, i) => (
                <li key={s.id} role="option" aria-selected={i === ativo}>
                  <button type="button" className={i === ativo ? 'active' : ''} onMouseEnter={() => setAtivo(i)} onClick={() => abrir(s)}>
                    <span className="palette-icon" style={{ color: s.appColor }}>
                      {s.hasLogo && s.logoUrl ? <img src={s.logoUrl} alt="" /> : <SystemIcon name={s.iconName} className="system-icon" />}
                    </span>
                    <span className="palette-text"><strong>{s.name}</strong><small>{s.domain}</small></span>
                    <StatusPill status={status?.get(s.id)} carregando={!status} />
                    <ArrowUpRight size={16} />
                  </button>
                </li>
              ))}
              {!resultados.length && <li className="palette-empty">Nenhum sistema com “{termo}”.</li>}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
