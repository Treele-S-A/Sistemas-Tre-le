import React, { useState } from 'react';
import { EnterpriseSystem, User } from '../types';
import { SystemIcon } from './SystemIcon';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  HardHat,
  Compass,
  Building2,
  Boxes,
  Users,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';

interface SystemModalWorkspaceProps {
  system: EnterpriseSystem;
  currentUser: User;
  onClose: () => void;
}

export const SystemModalWorkspace: React.FC<SystemModalWorkspaceProps> = ({
  system,
  currentUser,
  onClose,
}) => {
  // Simulated interactive state for Sienge
  const [siengeContracts] = useState([
    { code: 'MED-2026-04', obra: 'Edifício Residencial Treèle Jardins', valor: 'R$ 342.800,00', status: 'Aprovada' },
    { code: 'MED-2026-03', obra: 'Condomínio Horizonte Treèle', valor: 'R$ 189.450,00', status: 'Em Análise' },
  ]);

  // Simulated interactive state for Mobuss
  const [fvsList, setFvsList] = useState([
    { id: 'FVS-104', servico: 'Concretagem de Laje - 5º Pavimento', status: 'Conforme', data: 'Hoje, 09:15' },
    { id: 'FVS-103', servico: 'Armação de Pilares e Vigas', status: 'Conforme', data: 'Ontem, 16:40' },
  ]);
  const [novoServico, setNovoServico] = useState('');

  // Simulated interactive state for GLPI
  const [chamados, setChamados] = useState([
    { id: 'TI-089', assunto: 'Configuração de acesso VPN no Canteiro', status: 'Em Atendimento' },
    { id: 'TI-084', assunto: 'Instalação de software BIM no notebook', status: 'Resolvido' },
  ]);
  const [novoChamado, setNovoChamado] = useState('');

  const handleAddFVS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoServico.trim()) return;
    setFvsList([
      { id: `FVS-${Math.floor(105 + Math.random() * 50)}`, servico: novoServico, status: 'Conforme', data: 'Agora mesmo' },
      ...fvsList
    ]);
    setNovoServico('');
  };

  const handleAddChamado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoChamado.trim()) return;
    setChamados([
      { id: `TI-${Math.floor(90 + Math.random() * 50)}`, assunto: novoChamado, status: 'Aberto' },
      ...chamados
    ]);
    setNovoChamado('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3.5">
            {system.hasLogo && system.logoUrl ? (
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 p-2 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={system.logoUrl}
                  alt={system.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 text-white shadow-xs"
                style={{ backgroundColor: system.appColor }}
              >
                <SystemIcon name={system.iconName} className="w-6 h-6 text-white" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">{system.name}</h2>
                {system.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <Clock className="w-3 h-3 text-amber-600" /> Em Implantação
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">{system.domain}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* Status Alert Banner */}
          {!system.isActive ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">Ambiente em fase de implantação técnica</p>
                <p className="text-amber-700 leading-relaxed">
                  O endereço <code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">{system.domain}</code> está sendo configurado nos servidores e DNS corporativos da Treèle Construtora.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
              <div className="text-xs text-emerald-950">
                <span className="font-bold block">Conexão segura autorizada para {currentUser.name}</span>
                <span className="text-emerald-700 mt-0.5 block">
                  Autenticação SSO via protocolo {system.ssoProtocol}
                </span>
              </div>
              <a
                href={system.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-bold text-white bg-[#005072] hover:bg-[#003850] rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>Abrir Sistema</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Description & Metadata */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sobre a Aplicação
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {system.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Módulos & Recursos Integrados
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {system.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Simulated Previews per System */}
          {system.id === 'sys_sienge' && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Últimas Medições no Sienge ERP:</span>
                <span className="text-[10px] text-slate-500 font-mono">treele.sienge.com.br</span>
              </div>
              <div className="divide-y divide-slate-100">
                {siengeContracts.map((c) => (
                  <div key={c.code} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#005072] font-mono block">{c.code}</span>
                      <span className="text-slate-600">{c.obra}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 block">{c.valor}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {system.id === 'sys_mobuss' && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Controle de Qualidade em Obra (FVS):</span>
                <span className="text-[10px] text-slate-500 font-mono">login.mobuss.com.br</span>
              </div>
              <form onSubmit={handleAddFVS} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Registrar nova inspeção de serviço..."
                  value={novoServico}
                  onChange={(e) => setNovoServico(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#ea580c] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Gravar</span>
                </button>
              </form>
              <div className="space-y-1.5">
                {fvsList.map((fvs) => (
                  <div key={fvs.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800">{fvs.servico}</span>
                      <span className="text-[10px] text-slate-400 block">{fvs.data}</span>
                    </div>
                    <span className="font-mono text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">
                      {fvs.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {system.id === 'sys_glpi' && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Solicitações de TI & Chamados (GLPI):</span>
                <span className="text-[10px] text-slate-500 font-mono">glpi.treele.com.br</span>
              </div>
              <form onSubmit={handleAddChamado} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Descreva o suporte ou equipamento necessário..."
                  value={novoChamado}
                  onChange={(e) => setNovoChamado(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#005072] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Abrir</span>
                </button>
              </form>
              <div className="space-y-1.5">
                {chamados.map((ch) => (
                  <div key={ch.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center border border-slate-100">
                    <span className="text-slate-800">{ch.assunto}</span>
                    <span className="font-mono text-[#005072] font-bold text-[11px]">{ch.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {system.domain}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Fechar
            </button>

            <a
              href={system.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-[#005072] hover:bg-[#003850] rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>{system.isActive ? 'Acessar Link' : 'Testar Link Direto'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
