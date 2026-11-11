import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, PawPrint } from 'lucide-react';
import { Pet } from '../types/crm';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePet: (petData: Partial<Pet>) => void;
  tutorName: string;
  petToEdit?: Pet | null;
}

export const PetModal: React.FC<PetModalProps> = ({
  isOpen,
  onClose,
  onSavePet,
  tutorName,
  petToEdit,
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'Cão' | 'Gato' | 'Pássaro' | 'Outro'>('Cão');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Macho' | 'Fêmea'>('Macho');
  const [weight, setWeight] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [allergies, setAllergies] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = Boolean(petToEdit);

  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name);
      setSpecies(petToEdit.species);
      setBreed(petToEdit.breed);
      setAge(petToEdit.age);
      setGender(petToEdit.gender);
      setWeight(petToEdit.weight.replace(/[^0-9.]/g, ''));
      setMicrochip(petToEdit.microchip || '');
      setAllergies(petToEdit.allergies ? petToEdit.allergies.join(', ') : '');
    } else {
      setName('');
      setSpecies('Cão');
      setBreed('');
      setAge('');
      setGender('Macho');
      setWeight('');
      setMicrochip('');
      setAllergies('');
    }
    setErrorMessage('');
  }, [petToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor, informe o nome do Pet.');
      return;
    }

    const emoji = species === 'Cão' ? '🐶' : species === 'Gato' ? '🐱' : species === 'Pássaro' ? '🦜' : '🐾';
    const allergiesList = allergies
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const petData: Partial<Pet> = {
      name: name.trim(),
      species,
      breed: breed.trim() || 'Sem Raça Definida',
      age: age.trim() || '1 ano',
      gender,
      weight: weight.trim() ? `${weight.trim()} kg` : '8.0 kg',
      avatarEmoji: emoji,
      microchip: microchip.trim() || undefined,
      allergies: allergiesList,
    };

    onSavePet(petData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-[#006c49]" />
              <h3 className="font-display font-bold text-base text-slate-900">
                {isEditing ? `Editar Ficha de ${petToEdit?.name}` : 'Cadastrar Novo Pet'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tutor responsável: <strong className="text-slate-800">{tutorName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Pet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Paçoca"
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Espécie
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              >
                <option value="Cão">🐶 Cão (Canino)</option>
                <option value="Gato">🐱 Gato (Felino)</option>
                <option value="Pássaro">🦜 Pássaro</option>
                <option value="Outro">🐾 Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Raça
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Golden Retriever, SRD..."
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sexo
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Idade
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ex: 3 anos"
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Peso Atual (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 14.2"
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Microchip (Opcional)
            </label>
            <input
              type="text"
              value={microchip}
              onChange={(e) => setMicrochip(e.target.value)}
              placeholder="Ex: 981098102938475"
              className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alergias ou Cuidados Especiais (separar por vírgula)
            </label>
            <textarea
              rows={2}
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Ex: Dermatite a pólen, intolerância a frango..."
              className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#006c49] hover:bg-[#005236] transition-all shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Pet' : 'Adicionar Pet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
