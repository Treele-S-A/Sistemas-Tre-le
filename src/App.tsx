import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, ArrowUpRight, Clock3, Grid2X2, Megaphone, Search, Star, Wifi, WifiOff, X } from 'lucide-react';
import { INITIAL_SYSTEMS, SYSTEM_CATEGORIES } from './data/systemsData';
import { AVISOS } from './data/avisos';
import { Header } from './components/Header';
import { SystemCard } from './components/SystemCard';
import { SystemIcon } from './components/SystemIcon';
import { CommandPalette } from './components/CommandPalette';
import { useHaQuanto, useListaLocal, useStatus, useTema } from './hooks/usePortal';
import hero from './assets/images/treele-hero-bg.png';

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const IDS = INITIAL_SYSTEMS.map((s) => s.id);
const MAX_RECENTES = 4;

function saudacao() {
  const hora = new Date().getHours();
  return hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
}

type Filtro = 'all' | 'favorites' | 'online' | 'problema';

export default function App() {
  const { tema, alternar } = useTema();
  const { status, verificadoEm, falhou } = useStatus();
  const haQuanto = useHaQuanto(verificadoEm);
  const [favoritos, setFavoritos] = useListaLocal('treele:favorites', IDS);
  const [recentes, setRecentes] = useListaLocal('treele:recentes', IDS);
  const [ocultos, setOcultos] = useListaLocal('treele:avisos-ocultos', AVISOS.map((a) => a.id));
  const [busca, setBusca] = useState('');
  const [area, setArea] = useState('all');
  const [filtro, setFiltro] = useState<Filtro>('all');
  const [paleta, setPaleta] = useState(false);

  useEffect(() => {
    const atalho = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaleta((v) => !v); }
    };
    window.addEventListener('keydown', atalho);
    return () => window.removeEventListener('keydown', atalho);
  }, []);

  const registrarAbertura = (id: string) => setRecentes((lista) => [id, ...lista.filter((x) => x !== id)].slice(0, MAX_RECENTES));
  const alternarFavorito = (id: string) => setFavoritos((lista) => lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);

  const situacao = (id: string) => status?.get(id)?.situacao;
  const online = status ? INITIAL_SYSTEMS.filter((s) => situacao(s.id) === 'online' || situacao(s.id) === 'lento').length : null;
  const comProblema = status ? INITIAL_SYSTEMS.filter((s) => situacao(s.id) === 'fora').length : 0;

  const hoje = new Date().toLocaleDateString('sv-SE');
  const avisos = AVISOS.filter((a) => (!a.ate || a.ate >= hoje) && !ocultos.includes(a.id));

  const sistemas = useMemo(() => {
    const termo = normalizar(busca.trim());
    return INITIAL_SYSTEMS.filter((s) => (area === 'all' || s.category === area)
      && (filtro === 'all' || (filtro === 'favorites' && favoritos.includes(s.id))
        || (filtro === 'online' && (situacao(s.id) === 'online' || situacao(s.id) === 'lento'))
        || (filtro === 'problema' && situacao(s.id) === 'fora'))
      && (!termo || normalizar([s.name, s.description, s.domain, ...s.tags].join(' ')).includes(termo)));
  }, [busca, area, filtro, favoritos, status]);

  // Sem busca nem filtro, os cartões ficam agrupados por área.
  const agrupar = !busca.trim() && filtro === 'all' && area === 'all';
  const grupos = agrupar
    ? SYSTEM_CATEGORIES.map((c) => ({ area: c, itens: sistemas.filter((s) => s.category === c.id) })).filter((g) => g.itens.length)
    : [{ area: null, itens: sistemas }];

  const abas = [
    { id: 'all' as Filtro, label: 'Todos', count: INITIAL_SYSTEMS.length, icon: Grid2X2 },
    { id: 'favorites' as Filtro, label: 'Favoritos', count: favoritos.length, icon: Star },
    { id: 'online' as Filtro, label: 'Online', count: online ?? '…', icon: Wifi },
    ...(comProblema ? [{ id: 'problema' as Filtro, label: 'Com problema', count: comProblema, icon: WifiOff }] : []),
  ];
  const limpar = () => { setBusca(''); setArea('all'); setFiltro('all'); };
  let indice = 0;

  return (
    <div className="portal">
      <a className="skip-link" href="#servicos">Ir para os sistemas</a>
      <Header tema={tema} onTema={alternar} onBuscar={() => setPaleta(true)} />

      <AnimatePresence>
        {avisos.map((aviso) => (
          <motion.div key={aviso.id} className={`aviso ${aviso.tipo}`} role="status"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="container aviso-inner">
              {aviso.tipo === 'novidade' ? <Megaphone size={16} /> : <AlertTriangle size={16} />}
              <p>{aviso.texto}{aviso.link && <> <a href={aviso.link} target="_blank" rel="noopener noreferrer">Abrir <ArrowUpRight size={13} /></a></>}</p>
              <button type="button" aria-label="Fechar aviso" onClick={() => setOcultos((l) => [...l, aviso.id])}><X size={16} /></button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <main id="conteudo" className="container">
        <motion.section className="hero" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <img className="hero-art" src={hero} alt="" />
          <div className="hero-content">
            <span className="eyebrow"><i /> PORTAL TREÈLE</span>
            <h1>{saudacao()}!<br /><em>Seus sistemas em um só lugar.</em></h1>
            <p>Acesse as ferramentas da Treèle com praticidade. Use <kbd>Ctrl K</kbd> para encontrar qualquer sistema.</p>
            <div className="hero-status" aria-live="polite">
              {falhou ? <><WifiOff size={15} /> Não foi possível verificar os sistemas agora.</>
                : online == null ? <><span className="dot checking" /> Verificando os sistemas…</>
                : <><span className={`dot ${comProblema ? 'fora' : 'online'}`} />
                    <strong>{online} de {INITIAL_SYSTEMS.length}</strong>&nbsp;sistemas online
                    {comProblema > 0 && <> · <button type="button" onClick={() => setFiltro('problema')}>{comProblema} com problema</button></>}
                    {haQuanto && <span className="muted">· verificado {haQuanto}</span>}</>}
            </div>
          </div>
        </motion.section>

        {recentes.length > 0 && (
          <section className="recentes" aria-label="Abertos recentemente">
            <span className="section-kicker"><Clock3 size={13} /> ABERTOS RECENTEMENTE</span>
            <div className="recentes-lista">
              {recentes.map((id) => INITIAL_SYSTEMS.find((s) => s.id === id)).filter(Boolean).map((s) => (
                <motion.a key={s!.id} href={s!.url} target="_blank" rel="noopener noreferrer" onClick={() => registrarAbertura(s!.id)}
                  className="recente" whileHover={{ y: -2 }} style={{ color: s!.appColor }}>
                  {s!.hasLogo && s!.logoUrl ? <img src={s!.logoUrl} alt="" /> : <SystemIcon name={s!.iconName} className="system-icon" />}
                  <span>{s!.name}</span><ArrowUpRight size={14} />
                </motion.a>
              ))}
            </div>
          </section>
        )}

        <section id="servicos" className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <div><span className="section-kicker">ACESSO RÁPIDO</span><h2 id="catalog-title">Nossos sistemas</h2><p>Encontre a ferramenta certa para o seu trabalho.</p></div>
            <div className="search">
              <Search size={19} />
              <input aria-label="Buscar sistemas" placeholder="Buscar sistema, área ou palavra-chave" value={busca} onChange={(e) => setBusca(e.target.value)} />
              {busca && <button type="button" aria-label="Limpar busca" onClick={() => setBusca('')}><X size={17} /></button>}
            </div>
          </div>

          <div className="catalog-toolbar">
            <nav className="tabs" aria-label="Filtrar sistemas">
              {abas.map((t) => (
                <button key={t.id} type="button" aria-pressed={filtro === t.id} className={filtro === t.id ? 'selected' : ''} onClick={() => setFiltro(t.id)}>
                  <t.icon size={16} />{t.label}<span>{t.count}</span>
                  {filtro === t.id && <motion.i className="tab-indicator" layoutId="tab-indicator" />}
                </button>
              ))}
            </nav>
            <label className="category-select">Área
              <select value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="all">Todas as áreas</option>
                {SYSTEM_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>

          <p className="result-count" aria-live="polite">{sistemas.length} {sistemas.length === 1 ? 'sistema encontrado' : 'sistemas encontrados'}</p>

          {sistemas.length ? grupos.map((g) => (
            <div key={g.area?.id ?? 'todos'} className="grupo">
              {g.area && <h3 className="grupo-titulo"><SystemIcon name={g.area.iconName} className="grupo-icone" />{g.area.name}<small>{g.area.description}</small></h3>}
              <motion.div layout className="services-grid">
                <AnimatePresence mode="popLayout">
                  {g.itens.map((s) => (
                    <SystemCard key={s.id} system={s} indice={indice++} status={status?.get(s.id)} carregando={!status && !falhou}
                      isFavorite={favoritos.includes(s.id)} onToggleFavorite={alternarFavorito} onAbrir={registrarAbertura} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )) : (
            <div className="empty-state">
              <Search size={30} />
              <h3>{filtro === 'favorites' && !favoritos.length ? 'Seus atalhos ficam aqui' : 'Nenhum sistema encontrado'}</h3>
              <p>{filtro === 'favorites' && !favoritos.length ? 'Toque na estrela de um sistema para salvá-lo neste navegador.' : 'Experimente outra palavra ou ajuste os filtros.'}</p>
              <button type="button" onClick={limpar}>Ver todos os sistemas</button>
            </div>
          )}

          <div className="catalog-note"><ArrowUpRight size={16} /><p>Os sistemas abrem em uma nova aba. Use as suas credenciais de cada sistema para entrar.</p></div>
        </section>
      </main>

      <footer className="footer container">
        <span>© {new Date().getFullYear()} Treèle Construtora · Portal Treèle</span>
        <span>Status verificado automaticamente a cada 2 minutos · <a href="https://glpi.treele.com.br" target="_blank" rel="noopener noreferrer">Precisa de ajuda? Abra um chamado</a></span>
      </footer>

      <CommandPalette aberto={paleta} onFechar={() => setPaleta(false)} sistemas={INITIAL_SYSTEMS} status={status} onAbrir={registrarAbertura} />
    </div>
  );
}
