import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  Heart, 
  Edit3, 
  Trash2, 
  Plus, 
  MapPin, 
  CreditCard,
  ArrowLeft,
  PawPrint
} from 'lucide-react';
import { Tutor, Pet, Appointment } from '../types/crm';

interface ClientsPetsViewProps {
  tutors: Tutor[];
  onOpenPetHistory: (fakeAppt: Appointment) => void;
  onOpenNewAppointment: () => void;
  onOpenCreateTutor: () => void;
  onOpenEditTutor: (tutor: Tutor) => void;
  onRequestDeleteTutor: (tutor: Tutor) => void;
  onOpenAddPet: (tutor: Tutor) => void;
  onOpenEditPet: (tutor: Tutor, pet: Pet) => void;
  onRequestDeletePet: (tutor: Tutor, pet: Pet) => void;
}

export const ClientsPetsView: React.FC<ClientsPetsViewProps> = ({
  tutors,
  onOpenPetHistory,
  onOpenNewAppointment,
  onOpenCreateTutor,
  onOpenEditTutor,
  onRequestDeleteTutor,
  onOpenAddPet,
  onOpenEditPet,
  onRequestDeletePet,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(tutors[0]?.id || null);
  // Mobile master-detail view toggle
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const filteredTutors = tutors.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search) ||
    t.pets.some(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.breed.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedTutor = tutors.find(t => t.id === selectedTutorId) || tutors[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Diretório de Clientes & Pacientes Pets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie o cadastro de tutores, dados de contato e a lista de animais atendidos pela clínica.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateTutor}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#006c49] hover:bg-[#005236] shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Novo Cliente (Tutor)</span>
          </button>
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#10b981] hover:bg-[#059669] shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>+ Agendar</span>
          </button>
        </div>
      </div>

      {/* Main Container: Master-Detail (Desktop 2 columns, Mobile switched views) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: Tutors List (hidden on mobile if detail is active) */}
        <div className={`lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[650px] ${
          mobileShowDetail ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Search Box */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por tutor, pet ou telefone..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#006c49] focus:bg-white transition-all"
              />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 shrink-0 tabular-nums">
              {filteredTutors.length} clientes
            </span>
          </div>

          {/* List items */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {filteredTutors.length > 0 ? (
              filteredTutors.map((tutor) => {
                const isSelected = selectedTutor?.id === tutor.id;
                return (
                  <div
                    key={tutor.id}
                    onClick={() => {
                      setSelectedTutorId(tutor.id);
                      setMobileShowDetail(true);
                    }}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-emerald-50/70 border-l-4 border-l-[#006c49]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${tutor.avatarColor}`}>
                        {tutor.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-900 truncate">{tutor.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 tabular-nums flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{tutor.phone}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                          {tutor.pets.map(p => (
                            <span key={p.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700">
                              <span>{p.avatarEmoji}</span>
                              <span className="truncate max-w-[80px]">{p.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhum cliente encontrado com os termos de busca.
              </div>
            )}
          </div>
        </div>

        {/* Right Detail: Selected Tutor & Pets (shown on desktop, or on mobile when active) */}
        <div className={`lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 flex-col h-[650px] overflow-y-auto ${
          mobileShowDetail ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Mobile Back Button */}
          <div className="lg:hidden pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
            <button
              onClick={() => setMobileShowDetail(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#006c49] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Lista de Clientes</span>
            </button>
            <span className="text-[11px] text-slate-400">Ficha do Cliente</span>
          </div>

          {selectedTutor ? (
            <div className="space-y-6">
              {/* Tutor Header Card with Edit / Delete actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${selectedTutor.avatarColor}`}>
                    {selectedTutor.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                        {selectedTutor.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-[#047857]">
                        Cliente Ativo
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="tabular-nums font-medium text-slate-700">{selectedTutor.phone}</span>
                      </span>
                      {selectedTutor.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{selectedTutor.email}</span>
                        </span>
                      )}
                      {selectedTutor.document && (
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="tabular-nums">{selectedTutor.document}</span>
                        </span>
                      )}
                    </div>

                    {selectedTutor.address && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{selectedTutor.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tutor Actions: Edit & Delete */}
                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={() => onOpenEditTutor(selectedTutor)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
                    title="Editar dados do tutor"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar Tutor</span>
                  </button>

                  <button
                    onClick={() => onRequestDeleteTutor(selectedTutor)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Excluir tutor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pets Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Animais Vinculados ({selectedTutor.pets.length})
                  </h4>
                  <button
                    onClick={() => onOpenAddPet(selectedTutor)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#006c49] bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Pet</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedTutor.pets.map((pet) => (
                    <div 
                      key={pet.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-2xl flex items-center justify-center shrink-0">
                            {pet.avatarEmoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-base text-slate-900">{pet.name}</h5>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#047857] font-semibold">
                                {pet.gender}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {pet.species} • {pet.breed} • {pet.age} • Peso: <strong className="text-slate-700">{pet.weight}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Pet Actions */}
                        <div className="flex items-center gap-2 self-start">
                          <button
                            onClick={() => {
                              const fakeAppt: Appointment = {
                                id: `view-${pet.id}`,
                                tutorId: selectedTutor.id,
                                tutorName: selectedTutor.name,
                                tutorPhone: selectedTutor.phone,
                                tutorInitials: selectedTutor.initials,
                                tutorAvatarColor: selectedTutor.avatarColor,
                                petId: pet.id,
                                petName: pet.name,
                                petSpecies: pet.species,
                                petBreed: pet.breed,
                                petAge: pet.age,
                                petAvatarEmoji: pet.avatarEmoji,
                                serviceName: 'Consulta & Prontuário',
                                serviceCategory: 'clinica',
                                serviceIcon: 'stethoscope',
                                scheduledDateLabel: 'Hoje',
                                scheduledTime: '10:00',
                                locationOrDoctor: 'Consultório Principal',
                                status: 'agendado',
                                price: 180,
                                durationMinutes: 45,
                              };
                              onOpenPetHistory(fakeAppt);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#006c49] bg-white border border-[#006c49]/30 hover:bg-emerald-50 transition-colors shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Prontuário</span>
                          </button>

                          <button
                            onClick={() => onOpenEditPet(selectedTutor, pet)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors"
                            title="Editar dados do pet"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onRequestDeletePet(selectedTutor, pet)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Remover pet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Vaccines Summary */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[11px] text-slate-400 block">Vacinas Registradas</span>
                          <span className="font-semibold text-slate-800">{pet.vaccines.length} registradas</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block">Microchip</span>
                          <span className="font-mono text-slate-700 text-[11px] truncate block">
                            {pet.microchip || 'Sem microchip cadastrado'}
                          </span>
                        </div>
                      </div>

                      {/* Allergies tag */}
                      {pet.allergies && pet.allergies.length > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400 text-[11px]">Alergias:</span>
                          <div className="flex flex-wrap gap-1">
                            {pet.allergies.map((a, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Selecione um cliente ao lado para ver detalhes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
