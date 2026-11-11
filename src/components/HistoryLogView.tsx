import React, { useState } from 'react';
import { Search, Calendar, FileText, CheckCircle2, Clock, Filter, Download } from 'lucide-react';
import { Appointment } from '../types/crm';

interface HistoryLogViewProps {
  appointments: Appointment[];
  onOpenClinicalHistory: (appt: Appointment) => void;
}

export const HistoryLogView: React.FC<HistoryLogViewProps> = ({
  appointments,
  onOpenClinicalHistory,
}) => {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<'todos' | 'hoje' | 'concluidos'>('todos');

  const filtered = appointments.filter(a => {
    const matchesSearch = 
      a.tutorName.toLowerCase().includes(search.toLowerCase()) ||
      a.petName.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (period === 'hoje') return a.scheduledDateLabel === 'Hoje';
    if (period === 'concluidos') return a.status === 'concluido';
    return true;
  });

  const totalCompleted = appointments.filter(a => a.status === 'concluido').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Histórico Geral de Procedimentos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Registro consolidado de consultas, vacinações e atendimentos estéticos com auditoria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#047857]">
            {totalCompleted} atendimentos finalizados
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar histórico por paciente, tutor ou procedimento..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#006c49] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setPeriod('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              period === 'todos' ? 'bg-[#005236] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos os Registros
          </button>
          <button
            onClick={() => setPeriod('hoje')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              period === 'hoje' ? 'bg-[#005236] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Apenas Hoje
          </button>
          <button
            onClick={() => setPeriod('concluidos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              period === 'concluidos' ? 'bg-[#005236] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Apenas Concluídos
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#fafbfc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Data / Horário</th>
                <th className="py-3 px-6">Paciente Pet</th>
                <th className="py-3 px-6">Tutor Responsável</th>
                <th className="py-3 px-6">Serviço Realizado</th>
                <th className="py-3 px-6">Profissional / Local</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">{item.scheduledDateLabel}</span>
                    <span className="text-slate-400 block tabular-nums">{item.scheduledTime}</span>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.petAvatarEmoji}</span>
                      <div>
                        <strong className="text-slate-900 block font-semibold">{item.petName}</strong>
                        <span className="text-slate-500 text-[11px]">{item.petBreed}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-700">
                    <span className="font-medium text-slate-900">{item.tutorName}</span>
                    <span className="text-slate-400 block text-[11px] tabular-nums">{item.tutorPhone}</span>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span className="font-medium text-slate-800">{item.serviceName}</span>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-500">
                    {item.locationOrDoctor}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.status === 'concluido' ? 'bg-emerald-100 text-[#047857]' :
                      item.status === 'em_atendimento' ? 'bg-amber-100 text-amber-800' :
                      item.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'concluido' ? 'Concluído' :
                       item.status === 'em_atendimento' ? 'Em Atendimento' :
                       item.status === 'agendado' ? 'Agendado' : 'Cancelado'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-right">
                    <button
                      onClick={() => onOpenClinicalHistory(item)}
                      className="px-3 py-1 rounded-lg text-[11px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Prontuário
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
