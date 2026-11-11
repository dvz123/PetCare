import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Syringe, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Plus, 
  Check, 
  User, 
  Phone, 
  Printer, 
  MessageCircle,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { Appointment, Tutor, Pet, ClinicalEntry, VaccineRecord } from '../types/crm';

interface ClinicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  tutor: Tutor | undefined;
  onAddClinicalNote?: (petId: string, entry: ClinicalEntry) => void;
}

export const ClinicalHistoryModal: React.FC<ClinicalHistoryModalProps> = ({
  isOpen,
  onClose,
  appointment,
  tutor,
  onAddClinicalNote,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'vaccines' | 'allergies' | 'new_note'>('timeline');

  // Form state for new note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [notePrescription, setNotePrescription] = useState('');
  const [noteWeight, setNoteWeight] = useState('');
  const [isSuccessNote, setIsSuccessNote] = useState(false);

  if (!isOpen || !appointment) return null;

  const currentPet: Pet | undefined = tutor?.pets.find(p => p.name.toLowerCase() === appointment.petName.toLowerCase()) || tutor?.pets[0] || {
    id: appointment.petId,
    name: appointment.petName,
    species: appointment.petSpecies,
    breed: appointment.petBreed,
    age: appointment.petAge,
    gender: 'Macho',
    weight: '32.4 kg',
    avatarEmoji: appointment.petAvatarEmoji,
    microchip: '981098102938475',
    allergies: ['Dermatite tópica estacional', 'Sensibilidade a xampus convencionais'],
    vaccines: [
      {
        id: 'v-fallback-1',
        name: 'V10 Décupla Nobivac',
        dateGiven: '15/11/2025',
        nextDueDate: '15/11/2026',
        batch: 'NB-88291',
        veterinarian: 'Dra. Camila Ramos',
        status: 'em_dia',
      },
      {
        id: 'v-fallback-2',
        name: 'Anti-Rábica Defensor',
        dateGiven: '15/11/2025',
        nextDueDate: '15/11/2026',
        batch: 'DF-44120',
        veterinarian: 'Dra. Camila Ramos',
        status: 'em_dia',
      },
    ],
    clinicalHistory: [
      {
        id: 'ch-fallback-1',
        date: 'Hoje, 10/11/2026',
        time: appointment.scheduledTime,
        veterinarian: appointment.locationOrDoctor,
        title: `${appointment.serviceName} - Atendimento Atual`,
        description: appointment.notes || 'Paciente compareceu ao horário agendado. Parâmetros clínicos estáveis, pelagem íntegra e sem lesões visíveis.',
        weight: '32.4 kg',
      },
    ],
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteDescription.trim()) return;

    const newEntry: ClinicalEntry = {
      id: `note-${Date.now()}`,
      date: 'Hoje, 10/11/2026',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      veterinarian: 'Dra. Camila Ramos (CRMV-SP 48.291)',
      title: noteTitle,
      description: noteDescription,
      prescription: notePrescription || undefined,
      weight: noteWeight || undefined,
    };

    if (onAddClinicalNote && currentPet) {
      onAddClinicalNote(currentPet.id, newEntry);
    } else {
      currentPet?.clinicalHistory.unshift(newEntry);
    }

    setIsSuccessNote(true);
    setTimeout(() => {
      setIsSuccessNote(false);
      setActiveTab('timeline');
      setNoteTitle('');
      setNoteDescription('');
      setNotePrescription('');
      setNoteWeight('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#fbfcfc] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-3xl shadow-xs">
              {currentPet?.avatarEmoji || '🐾'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl text-slate-900">
                  {currentPet?.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-[#047857]">
                  Prontuário Ativo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentPet?.species} • {currentPet?.breed} • {currentPet?.age} • Peso: <strong className="text-slate-700">{currentPet?.weight}</strong>
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Tutor(a): {appointment.tutorName}</span>
                <span>•</span>
                <span className="tabular-nums">{appointment.tutorPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Imprimir Prontuário"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 border-b border-slate-200/70 bg-white flex items-center gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-[#006c49] text-[#006c49]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Linha do Tempo Clínica
          </button>
          <button
            onClick={() => setActiveTab('vaccines')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vaccines'
                ? 'border-[#006c49] text-[#006c49]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Carteira de Vacinação</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-50 text-[#006c49]">
              {currentPet?.vaccines.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('allergies')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'allergies'
                ? 'border-[#006c49] text-[#006c49]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Alergias & Alertas</span>
            {(currentPet?.allergies?.length || 0) > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('new_note')}
            className={`py-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'new_note'
                ? 'border-[#006c49] text-[#006c49]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Evolução Médica</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Histórico de Atendimentos & Prescrições
                </span>
                <span className="text-xs text-slate-400">
                  {currentPet?.clinicalHistory.length} registros clínicos
                </span>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {currentPet?.clinicalHistory.map((entry, idx) => (
                  <div key={entry.id || idx} className="relative pl-8 group">
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#10b981] group-hover:scale-125 transition-transform"></div>
                    <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-semibold text-sm text-slate-900">
                          {entry.title}
                        </h4>
                        <span className="text-xs text-slate-500 tabular-nums">
                          {entry.date} {entry.time ? `às ${entry.time}` : ''}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-800 font-medium mt-0.5 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3 text-[#006c49]" />
                        <span>{entry.veterinarian}</span>
                        {entry.weight && (
                          <span className="text-slate-400 ml-2 font-normal">
                            • Peso aferido: {entry.weight}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {entry.description}
                      </p>

                      {entry.prescription && (
                        <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs">
                          <strong className="text-emerald-900 font-semibold block mb-0.5">
                            Receituário / Prescrição:
                          </strong>
                          <span className="text-emerald-800 leading-relaxed font-mono text-[11px]">
                            {entry.prescription}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VACCINES */}
          {activeTab === 'vaccines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Carteira de Vacinação Oficial
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                  {currentPet?.vaccines.filter(v => v.status === 'em_dia').length} de {currentPet?.vaccines.length} em dia
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPet?.vaccines.map((v) => (
                  <div 
                    key={v.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006c49] flex items-center justify-center">
                          <Syringe className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900">{v.name}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">Lote: {v.batch}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        v.status === 'em_dia' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.status === 'em_dia' ? 'Em Dia' : 'Revacinar'}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Aplicação</span>
                        <span className="font-medium text-slate-700 tabular-nums">{v.dateGiven}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Próximo Reforço</span>
                        <span className="font-semibold text-[#006c49] tabular-nums">{v.nextDueDate}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500">
                      Aplicador: {v.veterinarian}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALLERGIES & RESTRICTIONS */}
          {activeTab === 'allergies' && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Restrições, Alergias e Cuidados Clínicos
              </span>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Alergias Cadastradas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentPet?.allergies?.map((allergy, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-white text-amber-900 border border-amber-200 rounded-lg font-medium shadow-2xs"
                    >
                      ⚠️ {allergy}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800">
                  Microchipagem & Identificação Eletrônica
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Microchip ISO 11784: <strong className="font-mono text-slate-900">{currentPet?.microchip || 'Registrado na base nacional'}</strong>
                </p>
                <p className="text-slate-500">
                  Localização do transponder: região interescapular dorsal.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: NEW CLINICAL NOTE FORM */}
          {activeTab === 'new_note' && (
            <form onSubmit={handleSaveNote} className="space-y-4">
              {isSuccessNote && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Anotação clínica adicionada ao prontuário com sucesso!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título da Consulta / Procedimento *
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ex: Consulta de Retorno / Exame Físico Geral"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peso Aferido no Atendimento
                  </label>
                  <input
                    type="text"
                    value={noteWeight}
                    onChange={(e) => setNoteWeight(e.target.value)}
                    placeholder="Ex: 32.5 kg"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Veterinário Responsável
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Dra. Camila Ramos (CRMV-SP 48.291)"
                    className="w-full px-3.5 py-2 text-sm bg-slate-100 text-slate-600 rounded-xl border border-slate-200 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Anamnese, Exame Clínico e Diagnóstico *
                </label>
                <textarea
                  rows={3}
                  required
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  placeholder="Descreva queixas do tutor, palpação, ausculta cardiopulmonar, conduta terapêutica..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prescrição Médica / Medicamentos (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={notePrescription}
                  onChange={(e) => setNotePrescription(e.target.value)}
                  placeholder="Ex: Amoxicilina + Clavulanato 250mg 1 comp a cada 12h por 10 dias..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none resize-none font-mono text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#006c49] hover:bg-[#005236] transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar no Prontuário</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-[#fbfcfc] flex items-center justify-between text-xs text-slate-500">
          <span>Última sincronização clínica: Hoje, 10/11/2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 transition-colors"
          >
            Fechar Prontuário
          </button>
        </div>
      </div>
    </div>
  );
};
