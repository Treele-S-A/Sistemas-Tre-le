import React, { useState } from 'react';
import { User } from '../types';
import { 
  LogOut, 
  ChevronDown,
  Layers,
  UserCheck
} from 'lucide-react';
import { PRESET_USERS } from '../data/usersData';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onLogout: () => void;
  activeFilter: 'all' | 'favorites';
  setActiveFilter: (filter: 'all' | 'favorites') => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onLogout,
  activeFilter,
  setActiveFilter,
  favoritesCount,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
                Treele Hub
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">
                Portal de Sistemas
              </span>
            </div>
          </div>

          {/* Zone 2: Simple Navigation Tabs */}
          <nav className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveFilter('all')}
              className={`py-1.5 px-3 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Todos os Sistemas
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`py-1.5 px-3 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'favorites'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Favoritos</span>
              {favoritesCount > 0 && (
                <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: User Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    {currentUser.department}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser.email}</p>
                    <p className="text-[11px] text-blue-600 font-medium mt-1">{currentUser.department}</p>
                  </div>

                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Trocar Usuário (Teste):
                    </span>
                    <div className="space-y-1">
                      {PRESET_USERS.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSwitchUser(user);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            user.id === currentUser.id
                              ? 'bg-blue-50 text-blue-800 font-medium'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{user.name}</span>
                          {user.id === currentUser.id && (
                            <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-2 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
