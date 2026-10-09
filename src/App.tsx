import React, { useState, useMemo } from 'react';
import { User, EnterpriseSystem, CategoryId } from './types';
import { PRESET_USERS } from './data/usersData';
import { SYSTEM_CATEGORIES, INITIAL_SYSTEMS } from './data/systemsData';
import { Header } from './components/Header';
import { SystemCard } from './components/SystemCard';
import { SystemModalWorkspace } from './components/SystemModalWorkspace';
import { LoginScreen } from './components/LoginScreen';
import { Search, X, Star } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(PRESET_USERS[0]);

  // Data State
  const [systems] = useState<EnterpriseSystem[]>(INITIAL_SYSTEMS);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['sys_erp', 'sys_ponto', 'sys_workspace', 'sys_slack']);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites'>('all');

  // Modal State
  const [activeWorkspaceSystem, setActiveWorkspaceSystem] = useState<EnterpriseSystem | null>(null);

  const handleToggleFavorite = (systemId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(systemId)
        ? prev.filter((id) => id !== systemId)
        : [...prev, systemId]
    );
  };

  const handleLaunchSystem = (system: EnterpriseSystem) => {
    setActiveWorkspaceSystem(system);
  };

  // Filtered systems
  const filteredSystems = useMemo(() => {
    return systems.filter((sys) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = sys.name.toLowerCase().includes(query);
        const matchDesc = sys.description.toLowerCase().includes(query);
        const matchShort = sys.shortCode.toLowerCase().includes(query);
        const matchVendor = sys.vendor.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchShort && !matchVendor) {
          return false;
        }
      }

      // Favorites
      if (activeFilter === 'favorites') {
        if (!favoriteIds.includes(sys.id)) return false;
      }

      // Category
      if (selectedCategory !== 'all' && sys.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [systems, searchQuery, activeFilter, favoriteIds, selectedCategory]);

  if (!currentUser) {
    return <LoginScreen onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        favoritesCount={favoriteIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title & Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sistemas Corporativos
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Escolha o sistema que deseja acessar com sua conta corporativa ({currentUser.email}):
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar sistema pelo nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todos ({systems.length})
            </button>
            {SYSTEM_CATEGORIES.map((cat) => {
              const count = systems.filter((s) => s.category === cat.id).length;
              if (count === 0) return null;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid of System Boxes */}
        {filteredSystems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSystems.map((system) => (
              <SystemCard
                key={system.id}
                system={system}
                isFavorite={favoriteIds.includes(system.id)}
                onToggleFavorite={handleToggleFavorite}
                onLaunchSystem={handleLaunchSystem}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Nenhum sistema encontrado</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Nenhum resultado corresponde à sua busca "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setActiveFilter('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Ver todos os sistemas
            </button>
          </div>
        )}

      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <span>Treele Hub · Central de Sistemas</span>
          <span className="font-mono text-[11px] text-slate-400">Conectado como {currentUser.email}</span>
        </div>
      </footer>

      {/* System Workspace Launch Dialog */}
      {activeWorkspaceSystem && (
        <SystemModalWorkspace
          system={activeWorkspaceSystem}
          currentUser={currentUser}
          onClose={() => setActiveWorkspaceSystem(null)}
        />
      )}

    </div>
  );
}
