import React, { useState } from 'react';
import { X, Filter, Check, RotateCcw } from 'lucide-react';
import { ServiceCategory } from '../types/crm';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ServiceCategory | 'todos';
  onSelectCategory: (cat: ServiceCategory | 'todos') => void;
  selectedSpecies: 'todos' | 'Cão' | 'Gato';
  onSelectSpecies: (species: 'todos' | 'Cão' | 'Gato') => void;
  selectedStaff: string;
  onSelectStaff: (staff: string) => void;
  onReset: () => void;
}

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedSpecies,
  onSelectSpecies,
  selectedStaff,
  onSelectStaff,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#006c49]" />
            <h3 className="font-display font-bold text-base text-slate-900">
              Filtros Avançados
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Service Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Categoria de Procedimento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectCategory('todos')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedCategory === 'todos'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todas as Categorias
              </button>
              <button
                onClick={() => onSelectCategory('estetica')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedCategory === 'estetica'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Banho & Tosa
              </button>
              <button
                onClick={() => onSelectCategory('clinica')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedCategory === 'clinica'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Consulta Clínica
              </button>
              <button
                onClick={() => onSelectCategory('vacina')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  selectedCategory === 'vacina'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Vacinação
              </button>
              <button
                onClick={() => onSelectCategory('odonto')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all col-span-2 ${
                  selectedCategory === 'odonto'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Odontologia & Especialidades
              </button>
            </div>
          </div>

          {/* Species */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Espécie Animal
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSelectSpecies('todos')}
                className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                  selectedSpecies === 'todos'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => onSelectSpecies('Cão')}
                className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                  selectedSpecies === 'Cão'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🐶 Caninos
              </button>
              <button
                onClick={() => onSelectSpecies('Gato')}
                className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                  selectedSpecies === 'Gato'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🐱 Felinos
              </button>
            </div>
          </div>

          {/* Professional / Staff */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Profissional Responsável
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => onSelectStaff(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-[#006c49]"
            >
              <option value="todos">Todos os Profissionais</option>
              <option value="Dra. Camila">Dra. Camila Ramos (Clínica / Vacinas)</option>
              <option value="Dra. Fernanda">Dra. Fernanda Ortiz (Odonto / Cirurgia)</option>
              <option value="Dr. Bruno">Dr. Bruno Silveira (Clínica Geral)</option>
              <option value="Lucas">Esteticista Lucas (Banho & Tosa)</option>
              <option value="Amanda">Esteticista Amanda (Estética Felina/Canina)</option>
              <option value="Roberto">Esteticista Roberto (Banhos Especiais)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-[#fbfcfc] flex items-center justify-between">
          <button
            onClick={() => { onReset(); onClose(); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#006c49] hover:bg-[#005236] rounded-xl shadow-xs transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
