import React from 'react';
import { EnterpriseSystem } from '../types';
import { SystemIcon } from './SystemIcon';
import { ArrowUpRight, Star } from 'lucide-react';

interface SystemCardProps {
  system: EnterpriseSystem;
  isFavorite: boolean;
  onToggleFavorite: (systemId: string) => void;
  onLaunchSystem: (system: EnterpriseSystem) => void;
}

export const SystemCard: React.FC<SystemCardProps> = ({
  system,
  isFavorite,
  onToggleFavorite,
  onLaunchSystem,
}) => {
  return (
    <div 
      onClick={() => onLaunchSystem(system)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between p-5 cursor-pointer relative"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* System Icon */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: system.appColor }}
            >
              <SystemIcon name={system.iconName} className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
                {system.name}
              </h3>
              
              {/* Clean metadata */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-600">{system.shortCode}</span>
                <span aria-hidden="true">·</span>
                <span>{system.vendor}</span>
              </div>
            </div>
          </div>

          {/* Favorite Star */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(system.id);
            }}
            title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            className="p-1.5 rounded-lg text-slate-300 hover:text-amber-500 hover:bg-slate-50 transition-colors shrink-0"
          >
            <Star 
              className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} 
            />
          </button>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {system.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] font-medium text-slate-400">
          Clique para abrir
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLaunchSystem(system);
          }}
          className="py-1.5 px-3.5 text-xs font-semibold text-white bg-blue-600 group-hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
        >
          <span>Acessar</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
