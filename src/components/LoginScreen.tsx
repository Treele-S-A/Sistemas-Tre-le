import React, { useState } from 'react';
import { User } from '../types';
import { PRESET_USERS } from '../data/usersData';
import treeleLogo from '../assets/images/treele-logo.png';
import treeleHeroBg from '../assets/images/treele-hero-bg.png';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  HardHat,
  Compass,
  Building2
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
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#072430] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Architectural Blueprint Graphic from Treèle */}
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <img
          src={treeleHeroBg}
          alt="Treèle Construtora"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072430] via-[#072430]/80 to-[#072430]/60" />
      </div>

      {/* Decorative Brand Circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#84cc16]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#0284c7]/10 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl inline-block mb-3 border border-white/20">
          <img
            src={treeleLogo}
            alt="Treèle Construtora"
            className="h-12 sm:h-14 w-auto object-contain mx-auto"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          Central Corporativa de Sistemas
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Acesso seguro aos portais de engenharia, gestão e canteiros
        </p>
      </div>

      {/* Form Card */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl border border-slate-200 sm:px-10">

          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Single Sign-On (SSO)</span>
              <span className="text-[11px] text-slate-500">Credenciais corporativas @treele.com.br</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#005072]/10 text-[#005072] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Quick Select Profile for Demo */}
          <div className="mb-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Selecione o Perfil Treèle para Acessar:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {PRESET_USERS.map((usr) => {
                const isSelected = usr.id === selectedPresetId;
                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => handleSelectPreset(usr)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#005072] bg-[#005072]/10 text-[#005072] font-semibold shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold block truncate">{usr.name}</span>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {usr.jobTitle} · {usr.department}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#005072] shrink-0 ml-1.5" />
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
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005072]/20 focus:border-[#005072]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Senha de Rede
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005072]/20 focus:border-[#005072]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-[#005072] focus:ring-[#005072]"
                />
                <span>Token MFA Verificado</span>
              </label>

              <span className="text-[11px] text-[#005072] hover:underline cursor-pointer font-medium">
                Suporte TI
              </span>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-[#005072] hover:bg-[#003850] active:scale-98 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{isAuthenticating ? 'Autenticando no IdP Treèle...' : 'Entrar na Central de Sistemas'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">
              Treèle Construtora · Conexão Criptografada TLS 1.3 · ISO 27001
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
