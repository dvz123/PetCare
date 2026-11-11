import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Scissors, 
  Syringe, 
  Stethoscope, 
  Sparkles, 
  Clock, 
  MoreVertical, 
  FileText, 
  Phone, 
  Check, 
  Play, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Appointment, AppointmentStatus, ServiceCategory } from '../types/crm';

interface AppointmentsTableProps {
  appointments: Appointment[];
  allAppointments?: Appointment[];
  totalCount: number;
  activeStatusFilter: 'todos' | 'hoje' | 'agendado' | 'em_atendimento' | 'concluido';
  onStatusFilterChange: (status: 'todos' | 'hoje' | 'agendado' | 'em_atendimento' | 'concluido') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdvancedFilters: () => void;
  onOpenClinicalHistory: (appointment: Appointment) => void;
  onOpenWhatsApp: (appointment: Appointment) => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onRequestDeleteAppointment: (appointment: Appointment) => void;
  activeCategoryFilter?: string;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  allAppointments,
  totalCount,
  activeStatusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onOpenAdvancedFilters,
  onOpenClinicalHistory,
  onOpenWhatsApp,
  onUpdateStatus,
  onEditAppointment,
  onRequestDeleteAppointment,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Pagination calculations
  const totalPages = Math.ceil(appointments.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  const getServiceBadge = (appointment: Appointment) => {
    switch (appointment.serviceCategory) {
      case 'estetica':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e0f2fe] text-[#0369a1] border border-sky-200/60">
            <Scissors className="w-3.5 h-3.5" />
            <span>{appointment.serviceName}</span>
          </span>
        );
      case 'vacina':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#15803d] border border-emerald-200/60">
            <Syringe className="w-3.5 h-3.5" />
            <span>{appointment.serviceName}</span>
          </span>
        );
      case 'clinica':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f1f5f9] text-[#334155] border border-slate-200">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{appointment.serviceName}</span>
          </span>
        );
      case 'odonto':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f8fafc] text-[#475569] border border-slate-200">
            <span className="text-xs">🦷</span>
            <span>{appointment.serviceName}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{appointment.serviceName}</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'em_atendimento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
            <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse"></span>
            Em Atendimento
          </span>
        );
      case 'agendado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe]">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
            Agendado
          </span>
        );
      case 'concluido':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#d1fae5] text-[#047857] border border-[#a7f3d0]">
            <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
            Concluído
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            Cancelado
          </span>
        );
    }
  };

  const baseList = allAppointments || appointments;
  const totalAll = baseList.length;
  const hojeCount = baseList.filter(a => a.scheduledDateLabel === 'Hoje').length;
  const agendadosCount = baseList.filter(a => a.status === 'agendado').length;
  const emAtendimentoCount = baseList.filter(a => a.status === 'em_atendimento').length;
  const concluidosCount = baseList.filter(a => a.status === 'concluido').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top Filter and Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por tutor, pet, telefone ou serviço..."
            className="w-full pl-10 pr-8 py-2.5 bg-[#f8fafc] hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/70 focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Pills and Advanced Filters Button (Mobile horizontal scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => { onStatusFilterChange('todos'); setCurrentPage(1); }}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeStatusFilter === 'todos'
                ? 'bg-[#005236] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Todos ({totalAll})
          </button>
          <button
            onClick={() => { onStatusFilterChange('hoje'); setCurrentPage(1); }}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeStatusFilter === 'hoje'
                ? 'bg-[#005236] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Hoje ({hojeCount})
          </button>
          <button
            onClick={() => { onStatusFilterChange('agendado'); setCurrentPage(1); }}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeStatusFilter === 'agendado'
                ? 'bg-[#005236] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Agendados ({agendadosCount})
          </button>
          <button
            onClick={() => { onStatusFilterChange('em_atendimento'); setCurrentPage(1); }}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeStatusFilter === 'em_atendimento'
                ? 'bg-[#005236] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Em Atendimento ({emAtendimentoCount})
          </button>
          <button
            onClick={() => { onStatusFilterChange('concluido'); setCurrentPage(1); }}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeStatusFilter === 'concluido'
                ? 'bg-[#005236] text-white shadow-xs'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Concluídos ({concluidosCount})
          </button>

          <button
            onClick={onOpenAdvancedFilters}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW: Table (Hidden on small mobile screens < 768px) */}
      <div className="hidden md:block overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">TUTOR (CLIENTE)</th>
              <th className="py-3.5 px-4 sm:px-6">PET & ESPÉCIE</th>
              <th className="py-3.5 px-4 sm:px-6">SERVIÇO AGENDADO</th>
              <th className="py-3.5 px-4 sm:px-6">DATA & HORÁRIO</th>
              <th className="py-3.5 px-4 sm:px-6">STATUS</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentAppointments.length > 0 ? (
              currentAppointments.map((apt) => (
                <tr 
                  key={apt.id} 
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Tutor */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${apt.tutorAvatarColor}`}>
                        {apt.tutorInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {apt.tutorName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="tabular-nums">{apt.tutorPhone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Pet & Species */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50/80 border border-amber-100/80 flex items-center justify-center text-lg shrink-0">
                        {apt.petAvatarEmoji}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {apt.petName}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {apt.petBreed} • {apt.petAge}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Scheduled Service */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    {getServiceBadge(apt)}
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="tabular-nums">{apt.scheduledDateLabel}, {apt.scheduledTime}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {apt.locationOrDoctor}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    {getStatusBadge(apt.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                    <div className="relative inline-flex items-center gap-2">
                      <button
                        onClick={() => onOpenClinicalHistory(apt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver Histórico</span>
                      </button>

                      {/* Dropdown 3 dots */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === apt.id ? null : apt.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label="Mais opções"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === apt.id && (
                          <div 
                            className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
                            onMouseLeave={() => setActiveMenuId(null)}
                          >
                            <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Alterar Status
                            </div>
                            {apt.status !== 'em_atendimento' && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(apt.id, 'em_atendimento');
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50"
                              >
                                <Play className="w-3.5 h-3.5" />
                                Iniciar Atendimento
                              </button>
                            )}
                            {apt.status !== 'concluido' && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(apt.id, 'concluido');
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Marcar como Concluído
                              </button>
                            )}
                            {apt.status !== 'agendado' && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(apt.id, 'agendado');
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                Mudar para Agendado
                              </button>
                            )}
                            <div className="my-1 border-t border-slate-100"></div>
                            
                            <button
                              onClick={() => {
                                onEditAppointment(apt);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-500" />
                              Editar Agendamento
                            </button>

                            <button
                              onClick={() => {
                                onOpenWhatsApp(apt);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Lembrete WhatsApp
                            </button>
                            <button
                              onClick={() => {
                                onOpenClinicalHistory(apt);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              Prontuário Completo
                            </button>
                            <div className="my-1 border-t border-slate-100"></div>
                            <button
                              onClick={() => {
                                onRequestDeleteAppointment(apt);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Excluir Agendamento
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-800">Nenhum atendimento encontrado</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tente alterar os termos de busca ou remover os filtros aplicados.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE RESPONSIVE CARDS VIEW (< 768px) */}
      <div className="md:hidden divide-y divide-slate-100">
        {currentAppointments.length > 0 ? (
          currentAppointments.map((apt) => (
            <div key={apt.id} className="p-4 space-y-3 bg-white">
              {/* Card Header: Tutor & Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${apt.tutorAvatarColor}`}>
                    {apt.tutorInitials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{apt.tutorName}</h4>
                    <span className="text-xs text-slate-500 tabular-nums flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {apt.tutorPhone}
                    </span>
                  </div>
                </div>
                {getStatusBadge(apt.status)}
              </div>

              {/* Card Body: Pet & Service */}
              <div className="p-3 bg-slate-50/90 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{apt.petAvatarEmoji}</span>
                    <div>
                      <strong className="text-xs text-slate-900 block font-semibold">{apt.petName}</strong>
                      <span className="text-[11px] text-slate-500">{apt.petBreed} • {apt.petAge}</span>
                    </div>
                  </div>
                  <div>{getServiceBadge(apt)}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-900">{apt.scheduledDateLabel}, {apt.scheduledTime}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{apt.locationOrDoctor}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenClinicalHistory(apt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Prontuário</span>
                  </button>
                  <button
                    onClick={() => onEditAppointment(apt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#006c49] bg-emerald-50 hover:bg-emerald-100/80 flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenWhatsApp(apt)}
                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRequestDeleteAppointment(apt)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                    title="Excluir Agendamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            Nenhum atendimento encontrado.
          </div>
        )}
      </div>

      {/* Pagination & Footer */}
      <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 text-center sm:text-left">
          Mostrando <strong className="font-semibold text-slate-800 tabular-nums">{currentAppointments.length}</strong> de{' '}
          <strong className="font-semibold text-slate-800 tabular-nums">{appointments.length}</strong> atendimentos
          {appointments.length !== totalAll && (
            <span className="text-slate-400"> (filtrados de {totalAll} no total)</span>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                currentPage === 1
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
              }`}
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all tabular-nums ${
                  currentPage === page
                    ? 'bg-[#005236] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 bg-transparent'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                currentPage === totalPages
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
              }`}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
