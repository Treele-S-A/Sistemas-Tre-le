import { motion } from 'motion/react';
import { ArrowUpRight, Hammer, Star } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { EnterpriseSystem } from '../types';
import type { StatusSistema } from '../../server/verificarStatus';
import { SYSTEM_CATEGORIES } from '../data/systemsData';
import { AREAS } from '../data/portal';
import { SystemIcon } from './SystemIcon';

interface Props {
  system: EnterpriseSystem; indice: number; status: StatusSistema | undefined; carregando: boolean;
  isFavorite: boolean; onToggleFavorite: (id: string) => void;
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

export function SystemCard({ system, indice, status, carregando, isFavorite, onToggleFavorite }: Props) {
  const area = SYSTEM_CATEGORIES.find((c) => c.id === system.category)?.name;
  const cor = AREAS[system.category]?.cor ?? system.appColor;
  return (
    // Entrada em cascata só na abertura da página (indice >= 0); na troca de filtro os cartões entram juntos,
    // os que saem somem rápido e os que ficam só deslizam para o novo lugar (layout="position").
    <motion.article className="service-card" style={{ '--area': cor, '--app': system.appColor } as CSSProperties}
      layout="position"
      initial={{ opacity: 0, y: indice >= 0 ? 14 : 0, scale: indice >= 0 ? 1 : 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
      whileHover={{ y: -3 }}
      transition={{
        opacity: { duration: 0.22, delay: indice >= 0 ? Math.min(indice, 10) * 0.04 : 0 },
        y: { duration: 0.3, delay: indice >= 0 ? Math.min(indice, 10) * 0.04 : 0, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.2 },
        layout: { type: 'spring', stiffness: 420, damping: 36 },
      }}>
      <div className="card-head">
        {/* Ícones próprios da Treèle (/logos/) já são redondos e coloridos: sem a caixa branca dos logos de terceiros. */}
        <div className={`service-icon ${system.hasLogo && system.logoUrl ? (system.logoUrl.startsWith('/logos/') ? 'logo-treele' : 'has-logo') : ''}`}>
          {system.hasLogo && system.logoUrl
            ? <img src={system.logoUrl} alt={system.name} loading="lazy" />
            : <SystemIcon name={system.iconName} className="system-icon" />}
        </div>
        <div className="card-title">
          <span className="card-category">{area}</span>
          <h3>{system.name}</h3>
        </div>
        <button type="button" className={`favorite ${isFavorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(system.id)}
          aria-label={`${isFavorite ? 'Remover' : 'Adicionar'} ${system.name} ${isFavorite ? 'dos' : 'aos'} favoritos`} aria-pressed={isFavorite}>
          <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="card-description">{system.description}</p>
      <div className="card-bottom">
        {system.isActive && system.url ? <>
          <StatusPill status={status} carregando={carregando} />
          <a href={system.url} target="_blank" rel="noopener noreferrer" aria-label={`Acessar ${system.name} (abre em nova aba)`}>
            Acessar <ArrowUpRight size={15} />
          </a>
        </> : <>
          <span className="status em-desenvolvimento"><Hammer size={13} />Em desenvolvimento</span>
          <span className="em-breve">Em breve</span>
        </>}
      </div>
    </motion.article>
  );
}
