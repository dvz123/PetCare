import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, CreditCard, Check, AlertCircle, Plus, PawPrint } from 'lucide-react';
import { Tutor, Pet } from '../types/crm';

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTutor: (tutorData: Partial<Tutor>, initialPet?: Partial<Pet>) => void;
  tutorToEdit?: Tutor | null;
}

export const TutorModal: React.FC<TutorModalProps> = ({
  isOpen,
  onClose,
  onSaveTutor,
  tutorToEdit,
}) => {
  // Tutor state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [document, setDocument] = useState('');

  // Initial pet state (for when creating a new tutor)
  const [includePet, setIncludePet] = useState(true);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Cão' | 'Gato' | 'Pássaro' | 'Outro'>('Cão');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petGender, setPetGender] = useState<'Macho' | 'Fêmea'>('Macho');
  const [petWeight, setPetWeight] = useState('');
  const [petAllergies, setPetAllergies] = useState('');
  const [petMicrochip, setPetMicrochip] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = Boolean(tutorToEdit);

  useEffect(() => {
    if (tutorToEdit) {
      setName(tutorToEdit.name);
      setPhone(tutorToEdit.phone);
      setEmail(tutorToEdit.email || '');
      setAddress(tutorToEdit.address || '');
      setDocument(tutorToEdit.document || '');
      setIncludePet(false);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setDocument('');
      setIncludePet(true);
      setPetName('');
      setPetSpecies('Cão');
      setPetBreed('');
      setPetAge('');
      setPetGender('Macho');
      setPetWeight('');
      setPetAllergies('');
      setPetMicrochip('');
    }
    setErrorMessage('');
  }, [tutorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Por favor, informe ao menos o Nome e o Telefone do tutor.');
      return;
    }

    if (!isEditing && includePet && !petName.trim()) {
      setErrorMessage('Por favor, informe o nome do Pet ou desmarque o cadastro do animal.');
      return;
    }

    const initials = name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('');

    const tutorData: Partial<Tutor> = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@email.com`,
      address: address.trim(),
      document: document.trim(),
      initials: initials || 'CL',
    };

    let initialPetData: Partial<Pet> | undefined = undefined;
    if (!isEditing && includePet && petName.trim()) {
      const emoji = petSpecies === 'Cão' ? '🐶' : petSpecies === 'Gato' ? '🐱' : petSpecies === 'Pássaro' ? '🦜' : '🐾';
      const allergiesList = petAllergies
        .split(',')
        .map(a => a.trim())
        .filter(Boolean);

      initialPetData = {
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed.trim() || 'Sem Raça Definida (SRD)',
        age: petAge.trim() || '1 ano',
        gender: petGender,
        weight: petWeight.trim() ? `${petWeight.trim()} kg` : '8.5 kg',
        avatarEmoji: emoji,
        microchip: petMicrochip.trim() || undefined,
        allergies: allergiesList,
        vaccines: [],
        clinicalHistory: [],
      };
    }

    onSaveTutor(tutorData, initialPetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {isEditing ? 'Editar Dados do Cliente' : 'Cadastrar Novo Cliente (Tutor)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Atualize as informações de contato e endereço do tutor'
                : 'Insira os dados do tutor e vincule o primeiro pet da ficha'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section: Dados do Tutor */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              1. Informações do Tutor
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@email.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF / Documento
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço Residencial
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua das Palmeiras, 120 - Apto 42"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Pet Inicial (Only in create mode) */}
          {!isEditing && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  2. Vincular Primeiro Pet do Tutor
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={includePet}
                    onChange={(e) => setIncludePet(e.target.checked)}
                    className="rounded text-[#006c49] focus:ring-[#006c49]"
                  />
                  <span>Cadastrar Pet agora</span>
                </label>
              </div>

              {includePet && (
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome do Pet *
                      </label>
                      <input
                        type="text"
                        required={includePet}
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="Ex: Paçoca"
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Espécie
                      </label>
                      <select
                        value={petSpecies}
                        onChange={(e) => setPetSpecies(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                      >
                        <option value="Cão">🐶 Cão (Canino)</option>
                        <option value="Gato">🐱 Gato (Felino)</option>
                        <option value="Pássaro">🦜 Pássaro</option>
                        <option value="Outro">🐾 Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sexo
                      </label>
                      <select
                        value={petGender}
                        onChange={(e) => setPetGender(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                      >
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Raça
                      </label>
                      <input
                        type="text"
                        value={petBreed}
                        onChange={(e) => setPetBreed(e.target.value)}
                        placeholder="Ex: Golden, SRD..."
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Idade Aprox.
                      </label>
                      <input
                        type="text"
                        value={petAge}
                        onChange={(e) => setPetAge(e.target.value)}
                        placeholder="Ex: 2 anos"
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Peso Atual (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={petWeight}
                        onChange={(e) => setPetWeight(e.target.value)}
                        placeholder="Ex: 12.5"
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número do Microchip
                      </label>
                      <input
                        type="text"
                        value={petMicrochip}
                        onChange={(e) => setPetMicrochip(e.target.value)}
                        placeholder="Ex: 981098100000000"
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alergias conhecidas (separar por vírgula)
                      </label>
                      <input
                        type="text"
                        value={petAllergies}
                        onChange={(e) => setPetAllergies(e.target.value)}
                        placeholder="Ex: Picada de pulga, dipirona..."
                        className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#006c49] hover:bg-[#005236] transition-all shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Salvar Cadastro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
