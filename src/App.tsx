/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Download, Plus, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { AppointmentsTable } from './components/AppointmentsTable';
import { AppointmentModal } from './components/AppointmentModal';
import { TutorModal } from './components/TutorModal';
import { PetModal } from './components/PetModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ClinicalHistoryModal } from './components/ClinicalHistoryModal';
import { DailyReportModal } from './components/DailyReportModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { AdvancedFilterModal } from './components/AdvancedFilterModal';
import { ClientsPetsView } from './components/ClientsPetsView';
import { HistoryLogView } from './components/HistoryLogView';
import { SettingsView } from './components/SettingsView';
import { 
  INITIAL_APPOINTMENTS, 
  INITIAL_TUTORS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { 
  Appointment, 
  AppointmentStatus, 
  ClinicalEntry, 
  ClinicNotification, 
  Pet, 
  ServiceCategory, 
  Tutor 
} from './types/crm';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';

const LOCAL_STORAGE_APPTS_KEY = 'petcare_crm_appointments_v3';
const LOCAL_STORAGE_TUTORS_KEY = 'petcare_crm_tutors_v3';

export default function App() {
  const { user, loading } = useAuth();

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'agenda' | 'clientes' | 'historico' | 'config'>('agenda');

  // Core Data state (Initialized with clean 4 appointments, persisted to local storage)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_APPTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar agendamentos:', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  const [tutors, setTutors] = useState<Tutor[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TUTORS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar tutores:', e);
    }
    return INITIAL_TUTORS;
  });

  // Keep local storage in sync
  React.useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_APPTS_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Erro ao persistir agendamentos:', e);
    }
  }, [appointments]);

  React.useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TUTORS_KEY, JSON.stringify(tutors));
    } catch (e) {
      console.warn('Erro ao persistir tutores:', e);
    }
  }, [tutors]);

  const [notifications, setNotifications] = useState<ClinicNotification[]>(INITIAL_NOTIFICATIONS);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'todos' | 'hoje' | 'agendado' | 'em_atendimento' | 'concluido'>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'todos'>('todos');
  const [selectedSpecies, setSelectedSpecies] = useState<'todos' | 'Cão' | 'Gato'>('todos');
  const [selectedStaff, setSelectedStaff] = useState<string>('todos');

  // Modals state: Appointment CRUD
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

  // Modals state: Tutor CRUD
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [tutorToEdit, setTutorToEdit] = useState<Tutor | null>(null);

  // Modals state: Pet CRUD
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [selectedTutorForPet, setSelectedTutorForPet] = useState<Tutor | null>(null);

  // Modals state: Confirmation & Actions
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    itemName: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    itemName: '',
    onConfirm: () => {},
  });

  const [isClinicalHistoryOpen, setIsClinicalHistoryOpen] = useState(false);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /* ==========================================================
     CRUD: APPOINTMENTS (AGENDAMENTOS)
  ========================================================== */

  // 1. CREATE APPOINTMENT
  const handleAddAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);

    // Ensure tutor and pet exist in the directory
    setTutors(prev => {
      const existing = prev.find(t => t.name.toLowerCase() === newAppt.tutorName.toLowerCase());
      if (existing) {
        const hasPet = existing.pets.some(p => p.name.toLowerCase() === newAppt.petName.toLowerCase());
        if (!hasPet) {
          existing.pets.push({
            id: newAppt.petId,
            name: newAppt.petName,
            species: newAppt.petSpecies,
            breed: newAppt.petBreed,
            age: newAppt.petAge,
            gender: 'Macho',
            weight: '10.0 kg',
            avatarEmoji: newAppt.petAvatarEmoji,
            allergies: [],
            vaccines: [],
            clinicalHistory: [],
          });
        }
        return [...prev];
      } else {
        const newTutor: Tutor = {
          id: newAppt.tutorId,
          name: newAppt.tutorName,
          phone: newAppt.tutorPhone,
          email: `${newAppt.tutorName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
          initials: newAppt.tutorInitials,
          avatarColor: newAppt.tutorAvatarColor,
          createdAt: 'Hoje',
          pets: [
            {
              id: newAppt.petId,
              name: newAppt.petName,
              species: newAppt.petSpecies,
              breed: newAppt.petBreed,
              age: newAppt.petAge,
              gender: 'Macho',
              weight: '10.0 kg',
              avatarEmoji: newAppt.petAvatarEmoji,
              allergies: [],
              vaccines: [],
              clinicalHistory: [],
            },
          ],
        };
        return [newTutor, ...prev];
      }
    });

    showToast(`Agendamento de ${newAppt.petName} agendado para às ${newAppt.scheduledTime}!`);
  };

  // 2. UPDATE APPOINTMENT
  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    setAppointments(prev =>
      prev.map(a => (a.id === updatedAppt.id ? updatedAppt : a))
    );
    showToast(`Agendamento de ${updatedAppt.petName} atualizado com sucesso!`);
  };

  // 3. DELETE APPOINTMENT
  const handleDeleteAppointment = (apptId: string) => {
    const target = appointments.find(a => a.id === apptId);
    setAppointments(prev => prev.filter(a => a.id !== apptId));
    showToast(`Agendamento de ${target?.petName || 'horário'} cancelado e removido.`);
  };

  const handleRequestDeleteAppointment = (appt: Appointment) => {
    setDeleteModalConfig({
      isOpen: true,
      title: 'Excluir Agendamento',
      description: 'Deseja remover este horário da grade diária? Esta ação liberará a vaga para outro paciente.',
      itemName: `${appt.petName} (${appt.serviceName}) - ${appt.scheduledTime}`,
      onConfirm: () => handleDeleteAppointment(appt.id),
    });
  };

  // 4. QUICK STATUS UPDATE
  const handleUpdateStatus = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(a => {
        if (a.id === appointmentId) {
          let updatedLocation = a.locationOrDoctor;
          if (newStatus === 'concluido' && !a.locationOrDoctor.includes('Finalizado')) {
            const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            updatedLocation = `Finalizado às ${timeNow}`;
          }
          return {
            ...a,
            status: newStatus,
            locationOrDoctor: updatedLocation,
          };
        }
        return a;
      })
    );

    const statusLabels: Record<AppointmentStatus, string> = {
      agendado: 'Agendado',
      em_atendimento: 'Em Atendimento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    };
    showToast(`Status atualizado para: ${statusLabels[newStatus]}`);
  };

  /* ==========================================================
     CRUD: TUTORS / CLIENTS (CLIENTES)
  ========================================================== */

  // 1. SAVE TUTOR (CREATE OR UPDATE)
  const handleSaveTutor = (tutorData: Partial<Tutor>, initialPet?: Partial<Pet>) => {
    if (tutorToEdit) {
      // Edit existing
      setTutors(prev =>
        prev.map(t => {
          if (t.id === tutorToEdit.id) {
            return {
              ...t,
              ...tutorData,
            } as Tutor;
          }
          return t;
        })
      );
      // Also sync appointments for this tutor
      setAppointments(prev =>
        prev.map(a => {
          if (a.tutorId === tutorToEdit.id) {
            return {
              ...a,
              tutorName: tutorData.name || a.tutorName,
              tutorPhone: tutorData.phone || a.tutorPhone,
              tutorInitials: tutorData.initials || a.tutorInitials,
            };
          }
          return a;
        })
      );
      showToast(`Cadastro de ${tutorData.name} atualizado com sucesso!`);
    } else {
      // Create new tutor
      const colors = [
        'bg-[#A7F3D0] text-[#047857]',
        'bg-[#BFDBFE] text-[#1D4ED8]',
        'bg-[#FED7AA] text-[#C2410C]',
        'bg-[#E9D5FF] text-[#7E22CE]',
        'bg-[#E2E8F0] text-[#334155]',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newTutorId = `tut-${Date.now()}`;
      const newPetsList: Pet[] = [];

      if (initialPet && initialPet.name) {
        newPetsList.push({
          id: `pet-${Date.now()}`,
          name: initialPet.name,
          species: initialPet.species || 'Cão',
          breed: initialPet.breed || 'SRD',
          age: initialPet.age || '1 ano',
          gender: initialPet.gender || 'Macho',
          weight: initialPet.weight || '8.0 kg',
          avatarEmoji: initialPet.avatarEmoji || '🐶',
          microchip: initialPet.microchip,
          allergies: initialPet.allergies || [],
          vaccines: [],
          clinicalHistory: [],
        });
      }

      const newTutor: Tutor = {
        id: newTutorId,
        name: tutorData.name || 'Novo Tutor',
        phone: tutorData.phone || '',
        email: tutorData.email || '',
        address: tutorData.address,
        document: tutorData.document,
        initials: tutorData.initials || 'NT',
        avatarColor: randomColor,
        createdAt: 'Hoje',
        pets: newPetsList,
      };

      setTutors(prev => [newTutor, ...prev]);
      showToast(`Cliente ${newTutor.name} cadastrado com sucesso!`);
    }

    setTutorToEdit(null);
  };

  // 2. DELETE TUTOR
  const handleDeleteTutor = (tutorId: string) => {
    const target = tutors.find(t => t.id === tutorId);
    setTutors(prev => prev.filter(t => t.id !== tutorId));
    // Remove appointments of this tutor
    setAppointments(prev => prev.filter(a => a.tutorId !== tutorId));
    showToast(`Cliente ${target?.name} e seus registros foram removidos.`);
  };

  const handleRequestDeleteTutor = (tutor: Tutor) => {
    setDeleteModalConfig({
      isOpen: true,
      title: 'Excluir Cadastro do Tutor',
      description: 'Tem certeza de que deseja remover este cliente? Os pets e prontuários vinculados a ele também serão excluídos.',
      itemName: `${tutor.name} (${tutor.phone}) - ${tutor.pets.length} pets vinculados`,
      onConfirm: () => handleDeleteTutor(tutor.id),
    });
  };

  /* ==========================================================
     CRUD: PETS
  ========================================================== */

  // 1. SAVE PET (CREATE OR UPDATE)
  const handleSavePet = (petData: Partial<Pet>) => {
    if (!selectedTutorForPet) return;

    if (petToEdit) {
      // Edit pet
      setTutors(prev =>
        prev.map(t => {
          if (t.id === selectedTutorForPet.id) {
            return {
              ...t,
              pets: t.pets.map(p => {
                if (p.id === petToEdit.id) {
                  return { ...p, ...petData } as Pet;
                }
                return p;
              }),
            };
          }
          return t;
        })
      );
      // Sync appointments with updated pet info
      setAppointments(prev =>
        prev.map(a => {
          if (a.petId === petToEdit.id) {
            return {
              ...a,
              petName: petData.name || a.petName,
              petSpecies: petData.species || a.petSpecies,
              petBreed: petData.breed || a.petBreed,
              petAge: petData.age || a.petAge,
              petAvatarEmoji: petData.avatarEmoji || a.petAvatarEmoji,
            };
          }
          return a;
        })
      );
      showToast(`Ficha de ${petData.name} atualizada com sucesso!`);
    } else {
      // Add new pet
      const newPet: Pet = {
        id: `pet-${Date.now()}`,
        name: petData.name || 'Novo Pet',
        species: petData.species || 'Cão',
        breed: petData.breed || 'SRD',
        age: petData.age || '1 ano',
        gender: petData.gender || 'Macho',
        weight: petData.weight || '8.0 kg',
        avatarEmoji: petData.avatarEmoji || '🐾',
        microchip: petData.microchip,
        allergies: petData.allergies || [],
        vaccines: [],
        clinicalHistory: [],
      };

      setTutors(prev =>
        prev.map(t => {
          if (t.id === selectedTutorForPet.id) {
            return {
              ...t,
              pets: [...t.pets, newPet],
            };
          }
          return t;
        })
      );
      showToast(`Pet ${newPet.name} adicionado ao tutor ${selectedTutorForPet.name}!`);
    }

    setPetToEdit(null);
    setSelectedTutorForPet(null);
  };

  // 2. DELETE PET
  const handleDeletePet = (tutorId: string, petId: string) => {
    setTutors(prev =>
      prev.map(t => {
        if (t.id === tutorId) {
          return {
            ...t,
            pets: t.pets.filter(p => p.id !== petId),
          };
        }
        return t;
      })
    );
    setAppointments(prev => prev.filter(a => a.petId !== petId));
    showToast('Animal removido da ficha do cliente.');
  };

  const handleRequestDeletePet = (tutor: Tutor, pet: Pet) => {
    setDeleteModalConfig({
      isOpen: true,
      title: 'Excluir Ficha do Animal',
      description: 'Deseja remover este pet da ficha do tutor? Os agendamentos futuros deste animal serão cancelados.',
      itemName: `${pet.avatarEmoji} ${pet.name} (${pet.breed})`,
      onConfirm: () => handleDeletePet(tutor.id, pet.id),
    });
  };

  // 3. ADD CLINICAL NOTE TO PRONTUÁRIO
  const handleAddClinicalNote = (petId: string, entry: ClinicalEntry) => {
    setTutors(prev =>
      prev.map(t => {
        return {
          ...t,
          pets: t.pets.map(p => {
            if (p.id === petId || (selectedAppointment && p.name.toLowerCase() === selectedAppointment.petName.toLowerCase())) {
              return {
                ...p,
                clinicalHistory: [entry, ...p.clinicalHistory],
              };
            }
            return p;
          }),
        };
      })
    );
    showToast('Anotação adicionada ao prontuário médico!');
  };

  // Notifications
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  /* ==========================================================
     FILTERS & COMPUTED COUNTS
  ========================================================== */

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (statusFilter === 'hoje' && apt.scheduledDateLabel !== 'Hoje') {
        return false;
      }
      if (statusFilter === 'agendado' && apt.status !== 'agendado') {
        return false;
      }
      if (statusFilter === 'em_atendimento' && apt.status !== 'em_atendimento') {
        return false;
      }
      if (statusFilter === 'concluido' && apt.status !== 'concluido') {
        return false;
      }

      if (selectedCategory !== 'todos' && apt.serviceCategory !== selectedCategory) {
        return false;
      }

      if (selectedSpecies !== 'todos' && apt.petSpecies !== selectedSpecies) {
        return false;
      }

      if (selectedStaff !== 'todos' && !apt.locationOrDoctor.toLowerCase().includes(selectedStaff.toLowerCase())) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTutor = apt.tutorName.toLowerCase().includes(query);
        const matchesPet = apt.petName.toLowerCase().includes(query);
        const matchesBreed = apt.petBreed.toLowerCase().includes(query);
        const matchesService = apt.serviceName.toLowerCase().includes(query);
        const matchesPhone = apt.tutorPhone.includes(query);
        const matchesLocation = apt.locationOrDoctor.toLowerCase().includes(query);
        if (!matchesTutor && !matchesPet && !matchesBreed && !matchesService && !matchesPhone && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, statusFilter, selectedCategory, selectedSpecies, selectedStaff, searchQuery]);

  // Dynamic KPI counts
  const hojeCount = appointments.filter(a => a.scheduledDateLabel === 'Hoje').length;
  const inProgressCount = appointments.filter(a => a.status === 'em_atendimento').length;
  const completedCount = appointments.filter(a => a.status === 'concluido').length;
  const awaitingCount = appointments.filter(a => a.status === 'agendado').length;

  const inProgressAppts = appointments.filter(a => a.status === 'em_atendimento');
  const averageDurationMinutes = inProgressAppts.length > 0
    ? Math.round(inProgressAppts.reduce((acc, curr) => acc + (curr.durationMinutes || 45), 0) / inProgressAppts.length)
    : 35;

  const completionRate = hojeCount > 0 ? Math.round((completedCount / hojeCount) * 100) : 100;

  const vaccinesPendingCount = tutors.reduce((acc, t) => 
    acc + t.pets.reduce((pAcc, p) => pAcc + p.vaccines.filter(v => v.status === 'pendente').length, 0), 0
  ) || appointments.filter(a => a.serviceCategory === 'vacina').length || 1;

  const nextScheduledTime = useMemo(() => {
    const agendadosHoje = appointments.filter(a => a.status === 'agendado' && a.scheduledDateLabel === 'Hoje');
    if (agendadosHoje.length > 0) {
      return [...agendadosHoje].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))[0].scheduledTime;
    }
    const agendadosGeral = appointments.filter(a => a.status === 'agendado');
    if (agendadosGeral.length > 0) {
      return [...agendadosGeral].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))[0].scheduledTime;
    }
    const emAtendimento = appointments.filter(a => a.status === 'em_atendimento');
    if (emAtendimento.length > 0) {
      return emAtendimento[0].scheduledTime;
    }
    return appointments[0]?.scheduledTime || '--:--';
  }, [appointments]);

  const handleResetDefaults = () => {
    setAppointments(INITIAL_APPOINTMENTS);
    setTutors(INITIAL_TUTORS);
    try {
      localStorage.setItem(LOCAL_STORAGE_APPTS_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      localStorage.setItem(LOCAL_STORAGE_TUTORS_KEY, JSON.stringify(INITIAL_TUTORS));
    } catch (e) {
      console.warn('Erro ao resetar dados:', e);
    }
    showToast('Base redefinida para os 4 agendamentos padrão com sucesso!');
  };

  // Selected tutor for clinical history modal
  const selectedTutor = useMemo(() => {
    if (!selectedAppointment) return undefined;
    return tutors.find(
      t =>
        t.id === selectedAppointment.tutorId ||
        t.name.toLowerCase() === selectedAppointment.tutorName.toLowerCase()
    );
  }, [selectedAppointment, tutors]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#006c49] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans">
      {/* Top Navbar with responsive mobile drawer */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationRead}
        globalSearchQuery={searchQuery}
        onGlobalSearch={setSearchQuery}
        onOpenNewAppointment={() => {
          setAppointmentToEdit(null);
          setIsApptModalOpen(true);
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 bg-[#006c49] text-white px-4 sm:px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: ATENDIMENTOS & AGENDA */}
        {activeTab === 'agenda' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Page Title & Actions Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#006c49] tracking-wider uppercase mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span>CLÍNICA & ESTÉTICA PETCARE</span>
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  Painel de Atendimentos & Clientes
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Gerencie a rotina diária de consultas, banho, tosa e vacinas com tranquilidade, precisão e carinho.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setIsDailyReportOpen(true)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 transition-all shadow-xs"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Relatório Diário</span>
                </button>

                <button
                  onClick={() => {
                    setAppointmentToEdit(null);
                    setIsApptModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#10b981] hover:bg-[#059669] transition-all shadow-xs shadow-emerald-700/20"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Novo Agendamento</span>
                </button>
              </div>
            </div>

            {/* Metric / Stat Cards */}
            <MetricCards
              scheduledCount={hojeCount}
              inProgressCount={inProgressCount}
              completedCount={completedCount}
              vaccinesPendingCount={vaccinesPendingCount}
              nextScheduledTime={nextScheduledTime}
              awaitingCount={awaitingCount}
              completionRate={completionRate}
              averageDurationMinutes={averageDurationMinutes}
              activeStatusFilter={statusFilter}
              onFilterClick={(status) => setStatusFilter(status)}
            />

            {/* Appointments Table with Mobile Cards & CRUD actions */}
            <AppointmentsTable
              appointments={filteredAppointments}
              allAppointments={appointments}
              totalCount={appointments.length}
              activeStatusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAdvancedFilters={() => setIsAdvancedFiltersOpen(true)}
              onOpenClinicalHistory={(apt) => {
                setSelectedAppointment(apt);
                setIsClinicalHistoryOpen(true);
              }}
              onOpenWhatsApp={(apt) => {
                setSelectedAppointment(apt);
                setIsWhatsAppModalOpen(true);
              }}
              onUpdateStatus={handleUpdateStatus}
              onEditAppointment={(apt) => {
                setAppointmentToEdit(apt);
                setIsApptModalOpen(true);
              }}
              onRequestDeleteAppointment={handleRequestDeleteAppointment}
            />
          </div>
        )}

        {/* TAB 2: CLIENTES & PETS (FULL CRUD) */}
        {activeTab === 'clientes' && (
          <ClientsPetsView
            tutors={tutors}
            onOpenPetHistory={(fakeAppt) => {
              setSelectedAppointment(fakeAppt);
              setIsClinicalHistoryOpen(true);
            }}
            onOpenNewAppointment={() => {
              setAppointmentToEdit(null);
              setIsApptModalOpen(true);
            }}
            onOpenCreateTutor={() => {
              setTutorToEdit(null);
              setIsTutorModalOpen(true);
            }}
            onOpenEditTutor={(tutor) => {
              setTutorToEdit(tutor);
              setIsTutorModalOpen(true);
            }}
            onRequestDeleteTutor={handleRequestDeleteTutor}
            onOpenAddPet={(tutor) => {
              setSelectedTutorForPet(tutor);
              setPetToEdit(null);
              setIsPetModalOpen(true);
            }}
            onOpenEditPet={(tutor, pet) => {
              setSelectedTutorForPet(tutor);
              setPetToEdit(pet);
              setIsPetModalOpen(true);
            }}
            onRequestDeletePet={handleRequestDeletePet}
          />
        )}

        {/* TAB 3: HISTÓRICO GERAL */}
        {activeTab === 'historico' && (
          <HistoryLogView
            appointments={appointments}
            onOpenClinicalHistory={(apt) => {
              setSelectedAppointment(apt);
              setIsClinicalHistoryOpen(true);
            }}
          />
        )}

        {/* TAB 4: CONFIGURAÇÕES */}
        {activeTab === 'config' && <SettingsView onResetDefaults={handleResetDefaults} />}
      </main>

      {/* MODAL: Appointment CRUD (Create & Edit) */}
      <AppointmentModal
        isOpen={isApptModalOpen}
        onClose={() => {
          setIsApptModalOpen(false);
          setAppointmentToEdit(null);
        }}
        onAddAppointment={handleAddAppointment}
        onUpdateAppointment={handleUpdateAppointment}
        onDeleteAppointment={handleDeleteAppointment}
        appointmentToEdit={appointmentToEdit}
        existingTutors={tutors}
      />

      {/* MODAL: Tutor CRUD (Create & Edit) */}
      <TutorModal
        isOpen={isTutorModalOpen}
        onClose={() => {
          setIsTutorModalOpen(false);
          setTutorToEdit(null);
        }}
        onSaveTutor={handleSaveTutor}
        tutorToEdit={tutorToEdit}
      />

      {/* MODAL: Pet CRUD (Add & Edit Pet) */}
      <PetModal
        isOpen={isPetModalOpen}
        onClose={() => {
          setIsPetModalOpen(false);
          setPetToEdit(null);
          setSelectedTutorForPet(null);
        }}
        onSavePet={handleSavePet}
        tutorName={selectedTutorForPet?.name || ''}
        petToEdit={petToEdit}
      />

      {/* MODAL: Confirm Delete Dialog */}
      <DeleteConfirmModal
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={deleteModalConfig.onConfirm}
        title={deleteModalConfig.title}
        description={deleteModalConfig.description}
        itemName={deleteModalConfig.itemName}
      />

      {/* MODAL: Clinical History & Dossier */}
      <ClinicalHistoryModal
        isOpen={isClinicalHistoryOpen}
        onClose={() => {
          setIsClinicalHistoryOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        tutor={selectedTutor}
        onAddClinicalNote={handleAddClinicalNote}
      />

      {/* MODAL: Daily Report */}
      <DailyReportModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
        appointments={appointments}
      />

      {/* MODAL: WhatsApp Reminder */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />

      {/* MODAL: Advanced Filters */}
      <AdvancedFilterModal
        isOpen={isAdvancedFiltersOpen}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSpecies={selectedSpecies}
        onSelectSpecies={setSelectedSpecies}
        selectedStaff={selectedStaff}
        onSelectStaff={setSelectedStaff}
        onReset={() => {
          setSelectedCategory('todos');
          setSelectedSpecies('todos');
          setSelectedStaff('todos');
        }}
      />
    </div>
  );
}
