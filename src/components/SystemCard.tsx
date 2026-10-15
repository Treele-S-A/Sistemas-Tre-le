import { Star, ArrowUpRight, Clock3 } from 'lucide-react';
import { EnterpriseSystem } from '../types';
import { SYSTEM_CATEGORIES } from '../data/systemsData';
import treeleMark from '../assets/images/treele-mark.png';
interface Props { system: EnterpriseSystem; isFavorite: boolean; onToggleFavorite: (id: string) => void; }
export function SystemCard({ system, isFavorite, onToggleFavorite }: Props) {
  return <article className="service-card"><div className="card-top"><div className="service-icon"><img src={system.hasLogo && system.logoUrl ? system.logoUrl : treeleMark} alt={system.hasLogo && system.logoUrl ? system.name : "Treèle Construtora"} loading="lazy" /></div><button className={`favorite ${isFavorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(system.id)} aria-label={`${isFavorite ? 'Remover' : 'Adicionar'} ${system.name} ${isFavorite ? 'dos' : 'aos'} favoritos`} aria-pressed={isFavorite}><Star size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button></div><span className="card-category">{SYSTEM_CATEGORIES.find(c => c.id === system.category)?.name}</span><h3>{system.name}</h3><p className="card-description">{system.description}</p><div className="card-bottom"><span className={`status ${system.isActive ? 'available' : ''}`}>{system.isActive ? <><i />Disponível</> : <><Clock3 size={13} />Em implantação</>}</span><a href={system.url} target="_blank" rel="noopener noreferrer" aria-label={`Acessar ${system.name} (abre em nova aba)`}>Acessar <ArrowUpRight size={16} /></a></div></article>;
}
