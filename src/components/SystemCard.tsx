import { motion } from 'motion/react';
import { ArrowUpRight, Star } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { EnterpriseSystem } from '../types';
import type { StatusSistema } from '../../server/verificarStatus';
import { SYSTEM_CATEGORIES } from '../data/systemsData';
import { SystemIcon } from './SystemIcon';

interface Props {
  system: EnterpriseSystem; indice: number; status: StatusSistema | undefined; carregando: boolean;
  isFavorite: boolean; onToggleFavorite: (id: string) => void; onAbrir: (id: string) => void;
}

const ROTULO = { online: 'Online', lento: 'Lento', fora: 'Fora do ar' } as const;

export function StatusPill({ status, carregando }: { status: StatusSistema | undefined; carregando: boolean }) {
  if (!status) return <span className="status checking">{carregando ? 'Verificando…' : 'Sem verificação'}</span>;
  return (
    <span className={`status ${status.situacao}`} title={status.ms != null ? `Respondeu em ${status.ms} ms` : 'Não respondeu'}>
      <i />{ROTULO[status.situacao]}
    </span>
  );
}

export function SystemCard({ system, indice, status, carregando, isFavorite, onToggleFavorite, onAbrir }: Props) {
  const area = SYSTEM_CATEGORIES.find((c) => c.id === system.category)?.name;
  return (
    <motion.article className="service-card" style={{ '--app': system.appColor } as CSSProperties}
      layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: Math.min(indice, 12) * 0.045, ease: [0.22, 1, 0.36, 1] }}>
      <div className="card-top">
        <div className="service-icon">
          {system.hasLogo && system.logoUrl
            ? <img src={system.logoUrl} alt="" loading="lazy" />
            : <SystemIcon name={system.iconName} className="system-icon" />}
        </div>
        <button type="button" className={`favorite ${isFavorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(system.id)}
          aria-label={`${isFavorite ? 'Remover' : 'Adicionar'} ${system.name} ${isFavorite ? 'dos' : 'aos'} favoritos`} aria-pressed={isFavorite}>
          <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <span className="card-category">{area}</span>
      <h3>{system.name}</h3>
      <p className="card-description">{system.description}</p>
      <div className="card-bottom">
        <StatusPill status={status} carregando={carregando} />
        <a href={system.url} target="_blank" rel="noopener noreferrer" onClick={() => onAbrir(system.id)}
          aria-label={`Acessar ${system.name} (abre em nova aba)`}>Acessar <ArrowUpRight size={16} /></a>
      </div>
    </motion.article>
  );
}
