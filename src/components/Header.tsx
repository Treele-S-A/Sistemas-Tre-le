import logo from '../assets/images/treele-logo.png';
import { Grid2X2 } from 'lucide-react';
export function Header() {
  return <header className="header"><div className="container header-inner"><a href="#conteudo" aria-label="Treèle Construtora — início" className="brand"><img src={logo} alt="Treèle Construtora" /></a><div className="header-divider" /><span className="header-title">Central de serviços</span><a href="#servicos" className="header-link"><Grid2X2 size={16} /><span>Serviços da empresa</span></a></div></header>;
}
