import { useEffect, useState } from 'react';
import { Search, X, ArrowUpRight, Star, Grid2X2, Clock3 } from 'lucide-react';
import { INITIAL_SYSTEMS, SYSTEM_CATEGORIES } from './data/systemsData';
import { Header } from './components/Header';
import { SystemCard } from './components/SystemCard';
import hero from './assets/images/treele-hero-bg.png';
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export default function App() {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [filter, setFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { const saved = JSON.parse(localStorage.getItem('treele:favorites') || '[]'); return Array.isArray(saved) ? saved.filter(id => typeof id === 'string' && INITIAL_SYSTEMS.some(s => s.id === id)) : []; } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem('treele:favorites', JSON.stringify(favorites)); } catch {} }, [favorites]);
  const systems = INITIAL_SYSTEMS.filter(s => (area === 'all' || s.category === area) && (filter === 'all' || (filter === 'favorites' && favorites.includes(s.id)) || (filter === 'active' && s.isActive) || (filter === 'pending' && !s.isActive)) && normalize([s.name, s.description, s.domain, ...s.tags].join(' ')).includes(normalize(query.trim())));
  const active = INITIAL_SYSTEMS.filter(s => s.isActive).length;
  const tabs = [{id:'all', label:'Todos os serviços', count:INITIAL_SYSTEMS.length, icon:Grid2X2}, {id:'favorites', label:'Favoritos', count:favorites.length, icon:Star}, {id:'active', label:'Disponíveis', count:active, icon:ArrowUpRight}, {id:'pending', label:'Em implantação', count:INITIAL_SYSTEMS.length-active, icon:Clock3}];
  return <div className="portal"><a className="skip-link" href="#servicos">Ir para os serviços</a><Header /><main id="conteudo" className="container">
    <section className="hero"><img className="hero-art" src={hero} alt="" /><div className="hero-content"><span className="eyebrow"><i /> CONECTANDO NOSSA EMPRESA</span><h1>Tudo o que você precisa.<br /><em>Em um só lugar.</em></h1><p>Acesse os sistemas e serviços da Treèle com praticidade.<br />Mais conexão para construir o nosso dia a dia.</p><a className="hero-link" href="#servicos">Explorar serviços <ArrowUpRight size={17} /></a></div></section>
    <section id="servicos" className="catalog" aria-labelledby="catalog-title"><div className="catalog-heading"><div><span className="section-kicker">ACESSO RÁPIDO</span><h2 id="catalog-title">Nossos serviços</h2><p>Encontre a ferramenta certa para o seu trabalho.</p></div><div className="search"><Search size={19} /><input aria-label="Buscar serviços" placeholder="Buscar serviço, área ou palavra-chave" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="Limpar busca" onClick={() => setQuery('')}><X size={17} /></button>}</div></div>
    <div className="catalog-toolbar"><nav className="tabs" aria-label="Filtrar serviços">{tabs.map(t => <button key={t.id} aria-pressed={filter === t.id} className={filter === t.id ? 'selected' : ''} onClick={() => setFilter(t.id)}><t.icon size={16} />{t.label}<span>{t.count}</span></button>)}</nav><label className="category-select">Área<select value={area} onChange={e => setArea(e.target.value)}><option value="all">Todas as áreas</option>{SYSTEM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
    <p className="result-count" aria-live="polite">{systems.length} {systems.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}</p>
    {systems.length ? <div className="services-grid">{systems.map(system => <SystemCard key={system.id} system={system} isFavorite={favorites.includes(system.id)} onToggleFavorite={id => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />)}</div> : <div className="empty-state"><Search size={30} /><h3>{filter === 'favorites' && !favorites.length ? 'Seus atalhos ficam aqui' : 'Nenhum serviço encontrado'}</h3><p>{filter === 'favorites' && !favorites.length ? 'Toque na estrela de um serviço para salvá-lo neste navegador.' : 'Experimente outra palavra ou ajuste os filtros.'}</p><button onClick={() => {setQuery('');setArea('all');setFilter('all');}}>Ver todos os serviços</button></div>}
    <div className="catalog-note"><ArrowUpRight size={16} /><p>Os serviços abrem em uma nova aba. Utilize suas credenciais de cada sistema para entrar.</p></div></section></main><footer className="footer container"><span>© {new Date().getFullYear()} Treèle Construtora</span><span>Central de serviços · Tecnologia que aproxima.</span></footer></div>;
}
