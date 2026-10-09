import React, { useState, useEffect } from 'react';
import { EnterpriseSystem, User } from '../types';
import { SystemIcon } from './SystemIcon';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Send
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
  // Simulated punch clock for RH Ponto system
  const [punches, setPunches] = useState<string[]>(['08:02 - Entrada', '12:00 - Saída Almoço']);
  const [currentClockTime, setCurrentClockTime] = useState('');
  const [punchSuccessMessage, setPunchSuccessMessage] = useState('');

  // Simulated Jira tickets
  const [tickets, setTickets] = useState([
    { id: 'TI-4091', title: 'Solicitação de novo equipamento' },
    { id: 'TI-4082', title: 'Acesso à pasta compartilhada' },
  ]);
  const [newTicketTitle, setNewTicketTitle] = useState('');

  // Simulated CRM deals
  const [deals, setDeals] = useState([
    { id: '1', client: 'Hospital Israelita Albert Einstein', value: 'R$ 145.000', stage: 'Proposta' },
    { id: '2', client: 'Banco Safra Corporativo', value: 'R$ 380.000', stage: 'Negociação' },
  ]);
  const [newClientName, setNewClientName] = useState('');
  const [newDealValue, setNewDealValue] = useState('');

  // Simulated ERP Purchase Orders
  const [erpOrders, setErpOrders] = useState([
    { code: 'PED-9821', vendor: 'Dell Computadores', total: 'R$ 48.900' },
    { code: 'PED-9820', vendor: 'Amazon Web Services', total: 'R$ 12.340' },
  ]);

  // Update clock for ponto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentClockTime(now.toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePunchClock = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR');
    setPunches((prev) => [...prev, `${timeStr} - Registro Confirmado`]);
    setPunchSuccessMessage(`Ponto registrado com sucesso às ${timeStr}!`);
    setTimeout(() => setPunchSuccessMessage(''), 3000);
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;
    const newId = `TI-${Math.floor(4100 + Math.random() * 800)}`;
    setTickets([{ id: newId, title: newTicketTitle }, ...tickets]);
    setNewTicketTitle('');
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newDealValue.trim()) return;
    setDeals([
      { id: String(Date.now()), client: newClientName, value: `R$ ${newDealValue}`, stage: 'Novo Deal' },
      ...deals,
    ]);
    setNewClientName('');
    setNewDealValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: system.appColor }}
            >
              <SystemIcon name={system.iconName} className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{system.name}</h2>
              <span className="text-xs text-slate-500">{system.vendor}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-900 block">
                Acesso liberado para {currentUser.name}
              </span>
              <span className="text-xs text-blue-700 mt-0.5 block">
                {system.description}
              </span>
            </div>

            <a
              href={system.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>Abrir Sistema</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Demonstration workspace previews */}
          {system.id === 'sys_ponto' && (
            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
              <div className="text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Horário Oficial</span>
                <div className="text-3xl font-extrabold font-mono text-slate-900">
                  {currentClockTime || '08:00:00'}
                </div>
              </div>

              {punchSuccessMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg text-center font-medium">
                  {punchSuccessMessage}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handlePunchClock}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Bater Ponto Agora</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-700 block mb-1">Registros de Hoje:</span>
                {punches.map((p, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 text-xs text-slate-700 rounded font-mono">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {system.id === 'sys_erp' && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Últimos Pedidos no ERP:</span>
              <div className="divide-y divide-slate-100">
                {erpOrders.map((ord) => (
                  <div key={ord.code} className="py-2 flex justify-between text-xs">
                    <span className="font-mono font-bold text-blue-600">{ord.code}</span>
                    <span className="text-slate-700">{ord.vendor}</span>
                    <span className="font-mono text-slate-900">{ord.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {system.id === 'sys_crm' && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Oportunidades em Aberto:</span>
              <div className="space-y-2">
                {deals.map((d) => (
                  <div key={d.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{d.client}</span>
                    <span className="font-mono text-slate-700">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {system.id === 'sys_jira' && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Meus Chamados de Suporte:</span>
              <form onSubmit={handleAddTicket} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Novo chamado..."
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded"
                >
                  Abrir
                </button>
              </form>
              <div className="space-y-1">
                {tickets.map((t) => (
                  <div key={t.id} className="p-2 bg-slate-50 rounded text-xs flex justify-between">
                    <span>{t.title}</span>
                    <span className="font-mono text-blue-600 font-bold">{t.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
