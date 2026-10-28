import { LifeBuoy, Moon, Search, Sun } from 'lucide-react';
import logo from '../assets/images/treele-logo.png';
import type { Tema } from '../hooks/usePortal';

const GLPI = 'https://glpi.treele.com.br';

export function Header({ tema, onTema, onBuscar }: { tema: Tema; onTema: () => void; onBuscar: () => void }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#conteudo" aria-label="Portal Treèle — início" className="brand"><img src={logo} alt="Treèle Construtora" /></a>
        <div className="header-divider" />
        <span className="header-title">Portal Treèle</span>
        <div className="header-actions">
          <button type="button" className="search-trigger" onClick={onBuscar} aria-label="Buscar sistema (Ctrl+K)">
            <Search size={16} /><span>Buscar sistema</span><kbd>Ctrl K</kbd>
          </button>
          <a className="icon-button" href={GLPI} target="_blank" rel="noopener noreferrer" title="Precisa de ajuda? Abrir chamado no GLPI">
            <LifeBuoy size={18} /><span className="sr-only">Abrir chamado no GLPI</span>
          </a>
          <button type="button" className="icon-button" onClick={onTema} aria-label={tema === 'escuro' ? 'Usar tema claro' : 'Usar tema escuro'}
            title={tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}>
            {tema === 'escuro' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
