import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ExternalLink, LifeBuoy, Link2, Megaphone, Search, Star, WifiOff } from 'lucide-react';
import { INITIAL_SYSTEMS, SYSTEM_CATEGORIES } from './data/systemsData';
import { AVISOS } from './data/avisos';
import { AJUDA, AREAS, LINKS_UTEIS, ORDEM } from './data/portal';
import { Header } from './components/Header';
import { SystemCard } from './components/SystemCard';
import { useHaQuanto, useListaLocal, useStatus, useTema } from './hooks/usePortal';

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const IDS = INITIAL_SYSTEMS.map((s) => s.id);
const ATIVOS = INITIAL_SYSTEMS.filter((s) => s.isActive && s.url);
const posicao = (id: string) => { const i = ORDEM.indexOf(id); return i < 0 ? ORDEM.length : i; };

function saudacao() {
  const hora = new Date().getHours();
  return hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
}

// Filtro: 'todos', 'favoritos', 'fora' (só aparece quando algum sistema cai) ou o id de uma área.
type Filtro = string;

export default function App() {
  const { tema, alternar } = useTema();
  const { status, verificadoEm, falhou } = useStatus();
  const haQuanto = useHaQuanto(verificadoEm);
  const [favoritos, setFavoritos] = useListaLocal('treele:favorites', IDS);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const campoBusca = useRef<HTMLInputElement>(null);
  // Depois da primeira pintura, os cartões param de entrar em cascata (só a abertura da página tem o efeito).
  const jaAbriu = useRef(false);
  useEffect(() => { const t = window.setTimeout(() => { jaAbriu.current = true; }, 800); return () => window.clearTimeout(t); }, []);

  useEffect(() => {
    const atalho = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); campoBusca.current?.focus(); campoBusca.current?.select(); }
    };
    window.addEventListener('keydown', atalho);
    return () => window.removeEventListener('keydown', atalho);
  }, []);

  const alternarFavorito = (id: string) => setFavoritos((lista) => lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);
  const situacao = (id: string) => status?.get(id)?.situacao;
  // Só os sistemas com link entram na contagem; os em desenvolvimento ficam de fora.
  const noArTotal = ATIVOS.length;
  const noAr = status ? ATIVOS.filter((s) => situacao(s.id) !== 'fora').length : null;
  const foraDoAr = status ? ATIVOS.filter((s) => situacao(s.id) === 'fora').length : 0;

  const hoje = new Date().toLocaleDateString('sv-SE');
  const avisos = AVISOS.filter((a) => !a.ate || a.ate >= hoje);

  // Busca primeiro; os filtros e seus contadores trabalham sobre o resultado da busca.
  const buscados = useMemo(() => {
    const termo = normalizar(busca.trim());
    return INITIAL_SYSTEMS.filter((s) => !termo || normalizar([s.name, s.description, s.domain, s.shortCode, ...s.tags,
      SYSTEM_CATEGORIES.find((c) => c.id === s.category)?.name ?? ''].join(' ')).includes(termo));
  }, [busca]);
  const passa = (f: Filtro, id: string, categoria: string) =>
    f === 'todos' || (f === 'favoritos' && favoritos.includes(id)) || (f === 'fora' && situacao(id) === 'fora') || f === categoria;
  const sistemas = buscados.filter((s) => passa(filtro, s.id, s.category))
    .sort((a, b) => Number(favoritos.includes(b.id)) - Number(favoritos.includes(a.id)) || posicao(a.id) - posicao(b.id));

  const areasComSistema = SYSTEM_CATEGORIES.filter((c) => INITIAL_SYSTEMS.some((s) => s.category === c.id));
  const chips: { id: Filtro; label: string; cor?: string; icone?: typeof Star }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'favoritos', label: 'Favoritos', icone: Star },
    ...(foraDoAr ? [{ id: 'fora', label: 'Fora do ar', icone: WifiOff, cor: 'var(--fora)' }] : []),
    ...areasComSistema.map((c) => ({ id: c.id, label: AREAS[c.id]?.curto ?? c.name, cor: AREAS[c.id]?.cor })),
  ];
  const contar = (f: Filtro) => buscados.filter((s) => passa(f, s.id, s.category)).length;
  const abrirPrimeiro = () => {
    const primeiro = sistemas.find((s) => s.isActive && s.url);
    if (primeiro) window.open(primeiro.url, '_blank', 'noopener,noreferrer');
  };
  const limpar = () => { setBusca(''); setFiltro('todos'); };
  const novidade = avisos[0];

  return (
    <div className="portal">
      <a className="skip-link" href="#servicos">Ir para os sistemas</a>
      <Header ref={campoBusca} tema={tema} onTema={alternar} busca={busca} onBusca={setBusca} onEnter={abrirPrimeiro} />

      <main id="conteudo" className="container">
        <motion.section className="hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div>
            <h1>{saudacao()}! <em>Seus sistemas em um só lugar.</em></h1>
            {novidade && <p className="hero-novidade"><Megaphone size={14} aria-hidden /> Novidade: {novidade.texto}
              {novidade.link && <> <a href={novidade.link} target="_blank" rel="noopener noreferrer">Abrir</a></>}</p>}
          </div>
          <div className="hero-status" aria-live="polite">
            {falhou ? <><WifiOff size={15} /> Status indisponível agora</>
              : noAr == null ? <><span className="dot checking" /> Verificando os sistemas…</>
              : <><span className={`dot ${foraDoAr ? 'fora' : 'online'}`} />
                  <strong>{noAr} de {noArTotal}</strong>&nbsp;sistemas online{haQuanto && <span className="muted">· {haQuanto}</span>}</>}
          </div>
        </motion.section>

        <section id="servicos" className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-bar">
            <h2 id="catalog-title">Nossos sistemas</h2>
            <div className="chips" role="group" aria-label="Filtrar sistemas">
              {chips.map((c) => {
                const Icone = c.icone;
                const n = contar(c.id);
                return (
                  <button key={c.id} type="button" aria-pressed={filtro === c.id} onClick={() => setFiltro(c.id)}
                    className={`chip ${filtro === c.id ? 'selected' : ''}`} style={c.cor ? { '--chip': c.cor } as CSSProperties : undefined}>
                    {Icone && <Icone size={13} fill={c.id === 'favoritos' && filtro === c.id ? 'currentColor' : 'none'} />}
                    {c.cor && !Icone && <i className="chip-dot" />}
                    {c.label}{(c.id === 'todos' || c.id === 'fora' || filtro === c.id || busca) && <span>{n}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {sistemas.length ? (
            <div className="services-grid">
              <AnimatePresence mode="popLayout" initial={true}>
                {sistemas.map((s, i) => (
                  <SystemCard key={s.id} system={s} indice={jaAbriu.current ? -1 : i} status={status?.get(s.id)} carregando={!status && !falhou}
                    isFavorite={favoritos.includes(s.id)} onToggleFavorite={alternarFavorito} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="empty-state">
              <Search size={28} />
              <h3>{filtro === 'favoritos' && !favoritos.length ? 'Seus favoritos ficam aqui' : 'Nenhum sistema encontrado'}</h3>
              <p>{filtro === 'favoritos' && !favoritos.length ? 'Toque na estrela de um sistema para fixá-lo no começo da lista, neste navegador.' : 'Experimente outra palavra ou outro filtro.'}</p>
              <button type="button" onClick={limpar}>Ver todos os sistemas</button>
            </div>
          )}
        </section>

        <section className="apoio" aria-label="Avisos e ajuda">
          <div className="box box-avisos">
            <h3><Megaphone size={16} aria-hidden /> Novidades e avisos</h3>
            {avisos.length
              ? <ul>{avisos.map((a) => <li key={a.id} className={a.tipo}>{a.texto}
                  {a.link && <> <a href={a.link} target="_blank" rel="noopener noreferrer">Abrir <ArrowUpRight size={12} /></a></>}</li>)}</ul>
              : <p className="muted-text">Nenhum aviso no momento.</p>}
          </div>
          <div className="box">
            <h3><LifeBuoy size={16} aria-hidden /> Precisa de ajuda?</h3>
            <a className="box-link" href={AJUDA.glpi} target="_blank" rel="noopener noreferrer">Abrir chamado no GLPI <ExternalLink size={13} /></a>
            {AJUDA.ramal && <p>Ramal da TI: {AJUDA.ramal}</p>}
            {AJUDA.email && <p><a href={`mailto:${AJUDA.email}`}>{AJUDA.email}</a></p>}
          </div>
          {LINKS_UTEIS.length > 0 && (
            <div className="box">
              <h3><Link2 size={16} aria-hidden /> Links úteis</h3>
              {LINKS_UTEIS.map((l) => <a key={l.url} className="box-link" href={l.url} target="_blank" rel="noopener noreferrer">{l.titulo} <ExternalLink size={13} /></a>)}
            </div>
          )}
        </section>
      </main>

      <footer className="footer container">
        <span>© {new Date().getFullYear()} Treèle Construtora · Portal Treèle</span>
        <span>Os sistemas abrem em nova aba, com o login de cada um · status verificado a cada 2 minutos</span>
      </footer>
    </div>
  );
}
