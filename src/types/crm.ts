export type ServiceCategory = 'estetica' | 'vacina' | 'clinica' | 'odonto' | 'cirurgia';

export type AppointmentStatus = 'agendado' | 'em_atendimento' | 'concluido' | 'cancelado';

export interface VaccineRecord {
  id: string;
  name: string;
  dateGiven: string;
  nextDueDate: string;
  batch: string;
  veterinarian: string;
  status: 'em_dia' | 'pendente' | 'atrasado';
}

export interface ClinicalEntry {
  id: string;
  date: string;
  time: string;
  veterinarian: string;
  title: string;
  description: string;
  diagnosis?: string;
  prescription?: string;
  weight?: string;
  temperature?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: 'Cão' | 'Gato' | 'Pássaro' | 'Outro';
  breed: string;
  age: string;
  birthDate?: string;
  gender: 'Macho' | 'Fêmea';
  weight: string;
  avatarEmoji: string;
  color?: string;
  microchip?: string;
  allergies: string[];
  chronicConditions?: string[];
  vaccines: VaccineRecord[];
  clinicalHistory: ClinicalEntry[];
}

export interface Tutor {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  document?: string; // CPF
  initials: string;
  avatarColor: string;
  pets: Pet[];
  createdAt: string;
}

export interface Appointment {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorPhone: string;
  tutorInitials: string;
  tutorAvatarColor: string; // e.g. 'bg-emerald-100 text-emerald-800'
  petId: string;
  petName: string;
  petSpecies: 'Cão' | 'Gato' | 'Pássaro' | 'Outro';
  petBreed: string;
  petAge: string;
  petAvatarEmoji: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  serviceIcon: 'scissors' | 'syringe' | 'stethoscope' | 'tooth' | 'bath' | 'sparkles';
  scheduledDateLabel: string; // 'Hoje', 'Amanhã', '12/11/2026'
  scheduledTime: string; // '09:30', '10:15', etc.
  locationOrDoctor: string; // 'Sala Estética 02', 'Consultório 01 • Dra. Camila', 'Finalizado às 09:12'
  status: AppointmentStatus;
  price: number;
  notes?: string;
  durationMinutes: number;
  assignedStaff?: string;
}

export interface ClinicNotification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  type: 'vacina' | 'atendimento' | 'relatorio' | 'sistema';
}

export interface FilterState {
  searchQuery: string;
  statusFilter: 'todos' | 'hoje' | 'agendado' | 'em_atendimento' | 'concluido';
  serviceCategory?: ServiceCategory | 'todos';
  speciesFilter?: 'todos' | 'Cão' | 'Gato';
  staffFilter?: string;
}
