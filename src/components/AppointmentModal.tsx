import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Scissors, Syringe, Stethoscope, Sparkles, Check, AlertCircle, Trash2, PawPrint } from 'lucide-react';
import { Appointment, ServiceCategory, Tutor, AppointmentStatus } from '../types/crm';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (newAppt: Appointment) => void;
  onUpdateAppointment?: (updatedAppt: Appointment) => void;
  onDeleteAppointment?: (apptId: string) => void;
  appointmentToEdit?: Appointment | null;
  existingTutors?: Tutor[];
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  appointmentToEdit,
  existingTutors = [],
}) => {
  // Tutor & Pet selection mode
  const [useExistingTutor, setUseExistingTutor] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');

  // Form fields
  const [tutorName, setTutorName] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Cão' | 'Gato' | 'Pássaro' | 'Outro'>('Cão');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('estetica');
  const [serviceName, setServiceName] = useState('Banho & Tosa Completa');
  const [scheduledDate, setScheduledDate] = useState('Hoje');
  const [scheduledTime, setScheduledTime] = useState('11:30');
  const [locationOrDoctor, setLocationOrDoctor] = useState('Sala Estética 02');
  const [status, setStatus] = useState<AppointmentStatus>('agendado');
  const [price, setPrice] = useState('160');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = Boolean(appointmentToEdit);

  useEffect(() => {
    if (appointmentToEdit) {
      setTutorName(appointmentToEdit.tutorName);
      setTutorPhone(appointmentToEdit.tutorPhone);
      setPetName(appointmentToEdit.petName);
      setPetSpecies(appointmentToEdit.petSpecies);
      setPetBreed(appointmentToEdit.petBreed);
      setPetAge(appointmentToEdit.petAge);
      setServiceCategory(appointmentToEdit.serviceCategory);
      setServiceName(appointmentToEdit.serviceName);
      setScheduledDate(appointmentToEdit.scheduledDateLabel);
      setScheduledTime(appointmentToEdit.scheduledTime);
      setLocationOrDoctor(appointmentToEdit.locationOrDoctor);
      setStatus(appointmentToEdit.status);
      setPrice(String(appointmentToEdit.price));
      setNotes(appointmentToEdit.notes || '');
      setUseExistingTutor(false);
    } else {
      setTutorName('');
      setTutorPhone('');
      setPetName('');
      setPetSpecies('Cão');
      setPetBreed('');
      setPetAge('');
      setServiceCategory('estetica');
      setServiceName('Banho & Tosa Completa');
      setScheduledDate('Hoje');
      setScheduledTime('11:30');
      setLocationOrDoctor('Sala Estética 02');
      setStatus('agendado');
      setPrice('160');
      setNotes('');
      setUseExistingTutor(false);
      setSelectedTutorId('');
      setSelectedPetId('');
    }
    setErrorMessage('');
  }, [appointmentToEdit, isOpen]);

  // When an existing tutor is chosen in the dropdown
  const handleExistingTutorChange = (tutorId: string) => {
    setSelectedTutorId(tutorId);
    const tutor = existingTutors.find(t => t.id === tutorId);
    if (tutor) {
      setTutorName(tutor.name);
      setTutorPhone(tutor.phone);
      if (tutor.pets.length > 0) {
        const firstPet = tutor.pets[0];
        setSelectedPetId(firstPet.id);
        setPetName(firstPet.name);
        setPetSpecies(firstPet.species);
        setPetBreed(firstPet.breed);
        setPetAge(firstPet.age);
      }
    }
  };

  const handleExistingPetChange = (petId: string) => {
    setSelectedPetId(petId);
    const tutor = existingTutors.find(t => t.id === selectedTutorId);
    const pet = tutor?.pets.find(p => p.id === petId);
    if (pet) {
      setPetName(pet.name);
      setPetSpecies(pet.species);
      setPetBreed(pet.breed);
      setPetAge(pet.age);
    }
  };

  if (!isOpen) return null;

  const handleCategoryChange = (category: ServiceCategory) => {
    setServiceCategory(category);
    switch (category) {
      case 'estetica':
        setServiceName('Banho & Tosa Completa');
        setLocationOrDoctor('Sala Estética 01');
        setPrice('160');
        break;
      case 'vacina':
        setServiceName('Vacina V10 + Raiva');
        setLocationOrDoctor('Consultório 01 • Dra. Camila');
        setPrice('195');
        break;
      case 'clinica':
        setServiceName('Consulta Clínica Geral');
        setLocationOrDoctor('Consultório 02 • Dra. Camila');
        setPrice('180');
        break;
      case 'odonto':
        setServiceName('Limpeza de Tártaro com Ultrassom');
        setLocationOrDoctor('Centro Odonto • Dra. Fernanda');
        setPrice('450');
        break;
      case 'cirurgia':
        setServiceName('Procedimento Cirúrgico');
        setLocationOrDoctor('Bloco Cirúrgico A');
        setPrice('650');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorName.trim() || !petName.trim() || !tutorPhone.trim()) {
      setErrorMessage('Por favor, preencha os dados do tutor e do pet.');
      return;
    }

    const initials = tutorName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('');

    const petEmoji = petSpecies === 'Cão' ? '🐶' : petSpecies === 'Gato' ? '🐱' : petSpecies === 'Pássaro' ? '🦜' : '🐾';

    if (isEditing && appointmentToEdit && onUpdateAppointment) {
      const updatedAppt: Appointment = {
        ...appointmentToEdit,
        tutorName: tutorName.trim(),
        tutorPhone: tutorPhone.trim(),
        tutorInitials: initials || appointmentToEdit.tutorInitials,
        petName: petName.trim(),
        petSpecies,
        petBreed: petBreed.trim() || 'Sem raça definida',
        petAge: petAge.trim() || '1 ano',
        petAvatarEmoji: petEmoji,
        serviceName,
        serviceCategory,
        scheduledDateLabel: scheduledDate,
        scheduledTime,
        locationOrDoctor,
        status,
        price: parseFloat(price) || appointmentToEdit.price,
        notes,
      };
      onUpdateAppointment(updatedAppt);
    } else {
      const newAppt: Appointment = {
        id: `apt-${Date.now()}`,
        tutorId: selectedTutorId || `tut-${Date.now()}`,
        tutorName: tutorName.trim(),
        tutorPhone: tutorPhone.trim(),
        tutorInitials: initials || 'TP',
        tutorAvatarColor: 'bg-[#A7F3D0] text-[#047857]',
        petId: selectedPetId || `pet-${Date.now()}`,
        petName: petName.trim(),
        petSpecies,
        petBreed: petBreed.trim() || 'Sem raça definida',
        petAge: petAge.trim() || '1 ano',
        petAvatarEmoji: petEmoji,
        serviceName,
        serviceCategory,
        serviceIcon: serviceCategory === 'estetica' ? 'scissors' : serviceCategory === 'vacina' ? 'syringe' : serviceCategory === 'odonto' ? 'tooth' : 'stethoscope',
        scheduledDateLabel: scheduledDate,
        scheduledTime,
        locationOrDoctor,
        status,
        price: parseFloat(price) || 120,
        durationMinutes: 45,
        notes,
      };
      onAddAppointment(newAppt);
    }

    onClose();
  };

  const currentTutorPets = existingTutors.find(t => t.id === selectedTutorId)?.pets || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Atualize horários, especialidades, profissional ou observações clínicas'
                : 'Cadastre consultas, banho e tosa ou vacinações na grade diária'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick toggle: Existing Tutor vs New */}
          {!isEditing && existingTutors.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-medium text-slate-700">
                Vincular a cliente já cadastrado?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUseExistingTutor(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    !useExistingTutor ? 'bg-[#006c49] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Novo Tutor
                </button>
                <button
                  type="button"
                  onClick={() => setUseExistingTutor(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    useExistingTutor ? 'bg-[#006c49] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Selecionar da Base
                </button>
              </div>
            </div>
          )}

          {/* Existing Tutor Selector */}
          {!isEditing && useExistingTutor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/70">
              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">
                  Selecione o Cliente / Tutor *
                </label>
                <select
                  value={selectedTutorId}
                  onChange={(e) => handleExistingTutorChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-emerald-300 text-slate-900 outline-none"
                >
                  <option value="">Selecione um cliente...</option>
                  {existingTutors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">
                  Selecione o Pet do Tutor *
                </label>
                <select
                  value={selectedPetId}
                  onChange={(e) => handleExistingPetChange(e.target.value)}
                  disabled={!selectedTutorId || currentTutorPets.length === 0}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-emerald-300 text-slate-900 outline-none disabled:opacity-50"
                >
                  {currentTutorPets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.avatarEmoji} {p.name} ({p.breed})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Service Category Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Categoria do Serviço
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('estetica')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  serviceCategory === 'estetica'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold ring-1 ring-[#006c49]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>Banho & Tosa</span>
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('vacina')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  serviceCategory === 'vacina'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold ring-1 ring-[#006c49]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Syringe className="w-4 h-4" />
                <span>Vacinação</span>
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('clinica')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  serviceCategory === 'clinica'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold ring-1 ring-[#006c49]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Consulta Clínica</span>
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('odonto')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  serviceCategory === 'odonto'
                    ? 'border-[#006c49] bg-emerald-50 text-[#006c49] font-semibold ring-1 ring-[#006c49]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🦷</span>
                <span>Odontologia</span>
              </button>
            </div>
          </div>

          {/* Section: Tutor Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Tutor *
              </label>
              <input
                type="text"
                required
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                placeholder="Ex: Mariana Costa"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Telefone *
              </label>
              <input
                type="tel"
                required
                value={tutorPhone}
                onChange={(e) => setTutorPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Section: Pet Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Pet *
              </label>
              <input
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Ex: Thor"
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Espécie
              </label>
              <select
                value={petSpecies}
                onChange={(e) => setPetSpecies(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              >
                <option value="Cão">Cão (Canino)</option>
                <option value="Gato">Gato (Felino)</option>
                <option value="Pássaro">Pássaro (Ave)</option>
                <option value="Outro">Outro</option>
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
                placeholder="Golden Retriever"
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Idade
              </label>
              <input
                type="text"
                value={petAge}
                onChange={(e) => setPetAge(e.target.value)}
                placeholder="Ex: 3 anos"
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>
          </div>

          {/* Section: Service Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Procedimento Específico
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Previsto (R$)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Section: Date, Time & Professional */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data
              </label>
              <select
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              >
                <option value="Hoje">Hoje</option>
                <option value="Amanhã">Amanhã</option>
                <option value="12/11/2026">12/11/2026</option>
                <option value="13/11/2026">13/11/2026</option>
                <option value="14/11/2026">14/11/2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sala / Profissional Responsável
              </label>
              <input
                type="text"
                value={locationOrDoctor}
                onChange={(e) => setLocationOrDoctor(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
              />
            </div>
          </div>

          {/* Status selector (Especially useful when editing) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status do Atendimento
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setStatus('agendado')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  status === 'agendado' ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                ● Agendado
              </button>
              <button
                type="button"
                onClick={() => setStatus('em_atendimento')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  status === 'em_atendimento' ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                ● Em Atendimento
              </button>
              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  status === 'concluido' ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                ● Concluído
              </button>
              <button
                type="button"
                onClick={() => setStatus('cancelado')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  status === 'cancelado' ? 'bg-red-50 border-red-300 text-red-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                ● Cancelado
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações Médicas / Alergias
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Alérgico a dipirona, aplicar xampu suave hipoalergênico..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none resize-none"
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing && onDeleteAppointment && appointmentToEdit ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteAppointment(appointmentToEdit.id);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Horário</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#10b981] hover:bg-[#059669] shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
