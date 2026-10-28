import { forwardRef } from 'react';
import { LifeBuoy, Moon, Search, Sun, X } from 'lucide-react';
import logo from '../assets/images/treele-logo.png';
import type { Tema } from '../hooks/usePortal';
import { AJUDA } from '../data/portal';

type Props = {
  tema: Tema; onTema: () => void; busca: string; onBusca: (valor: string) => void; onEnter: () => void;
};

// Busca única do portal: filtra os cartões enquanto digita; Ctrl+K leva o cursor até aqui e Enter abre o primeiro.
export const Header = forwardRef<HTMLInputElement, Props>(function Header({ tema, onTema, busca, onBusca, onEnter }, ref) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#conteudo" aria-label="Portal Treèle — início" className="brand"><img src={logo} alt="Treèle Construtora" /></a>
        <div className="header-divider" />
        <span className="header-title">Portal Treèle</span>
        <div className="header-search">
          <Search size={16} aria-hidden />
          <input ref={ref} value={busca} onChange={(e) => onBusca(e.target.value)} aria-label="Buscar sistema"
            placeholder="Buscar sistema, área ou palavra-chave"
            onKeyDown={(e) => { if (e.key === 'Enter') onEnter(); if (e.key === 'Escape') onBusca(''); }} />
          {busca
            ? <button type="button" aria-label="Limpar busca" onClick={() => onBusca('')}><X size={15} /></button>
            : <kbd>Ctrl K</kbd>}
        </div>
        <a className="help-button" href={AJUDA.glpi} target="_blank" rel="noopener noreferrer" title="Abrir chamado no GLPI">
          <LifeBuoy size={16} aria-hidden /><span>Ajuda</span>
        </a>
        <button type="button" className="icon-button" onClick={onTema} aria-label={tema === 'escuro' ? 'Usar tema claro' : 'Usar tema escuro'}
          title={tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}>
          {tema === 'escuro' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
});
