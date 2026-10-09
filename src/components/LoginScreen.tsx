import React, { useState } from 'react';
import { User } from '../types';
import { PRESET_USERS } from '../data/usersData';
import { 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  KeyRound,
  CheckCircle2,
  Server
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('ti@treele.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('usr_ti_01');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSelectPreset = (user: User) => {
    setSelectedPresetId(user.id);
    setEmail(user.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    setTimeout(() => {
      const foundUser = PRESET_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        onLogin({ ...foundUser, mfaVerified: mfaEnabled });
      } else {
        // Fallback default admin user
        onLogin({
          ...PRESET_USERS[0],
          email,
          name: email.split('@')[0],
          mfaVerified: mfaEnabled,
        });
      }
      setIsAuthenticating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Architectural Hero Visual */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/corporate_hub_hero_1791551727532.jpg"
          alt="Treele Corporate Headquarters"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg mb-3">
          <Layers className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Treele Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Plataforma Centralizadora de Sistemas Corporativos & SSO
        </p>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-slate-200/80 sm:px-10">
          
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Single Sign-On (SSO)</span>
              <span className="text-[11px] text-slate-500">Autenticação centralizada com protocolo SAML / OIDC</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Quick Select Profile for Demo */}
          <div className="mb-6">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Selecione um Perfil para Testar:
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {PRESET_USERS.map((usr) => {
                const isSelected = usr.id === selectedPresetId;
                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => handleSelectPreset(usr)}
                    className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold block truncate">{usr.name}</span>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {usr.jobTitle} · {usr.department}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Senha de Rede Corporativa
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Validar Token MFA / 2FA</span>
              </label>

              <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                Esqueceu a senha?
              </span>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{isAuthenticating ? 'Autenticando no IdP...' : 'Entrar no Treele Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block">
              Certificação ISO 27001 · Conexão Criptografada TLS 1.3
            </span>
          </div>

        </div>
      </div>
      
    </div>
  );
};
