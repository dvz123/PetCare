import React from 'react';
import { Calendar, PawPrint, CheckCircle2, Syringe, Clock, Hourglass, TrendingUp, MessageSquare } from 'lucide-react';

interface MetricCardsProps {
  scheduledCount: number;
  inProgressCount: number;
  completedCount: number;
  vaccinesPendingCount: number;
  nextScheduledTime?: string;
  awaitingCount?: number;
  completionRate?: number;
  averageDurationMinutes?: number;
  onFilterClick?: (status: 'todos' | 'hoje' | 'agendado' | 'em_atendimento' | 'concluido') => void;
  activeStatusFilter?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  scheduledCount,
  inProgressCount,
  completedCount,
  vaccinesPendingCount,
  nextScheduledTime = '--:--',
  awaitingCount,
  completionRate = 100,
  averageDurationMinutes = 35,
  onFilterClick,
  activeStatusFilter,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Card 1: AGENDADOS HOJE */}
      <div 
        onClick={() => onFilterClick && onFilterClick(activeStatusFilter === 'hoje' ? 'todos' : 'hoje')}
        className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer group shadow-xs hover:shadow-md ${
          activeStatusFilter === 'hoje' ? 'border-[#006c49] ring-2 ring-[#006c49]/10' : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              AGENDADOS HOJE
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tabular-nums tracking-tight">
                {scheduledCount}
              </span>
              <span className="text-sm font-normal text-slate-500">
                {scheduledCount === 1 ? 'pet na grade' : 'pets na grade'}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            Próximo às <strong className="text-slate-800 font-semibold">{nextScheduledTime}</strong>
            {typeof awaitingCount === 'number' && (
              <span className="text-slate-400 font-normal"> • {awaitingCount} aguardando</span>
            )}
          </span>
        </div>
      </div>

      {/* Card 2: EM ATENDIMENTO */}
      <div 
        onClick={() => onFilterClick && onFilterClick(activeStatusFilter === 'em_atendimento' ? 'todos' : 'em_atendimento')}
        className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer group shadow-xs hover:shadow-md ${
          activeStatusFilter === 'em_atendimento' ? 'border-[#006c49] ring-2 ring-[#006c49]/10' : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              EM ATENDIMENTO
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tabular-nums tracking-tight">
                {inProgressCount}
              </span>
              <span className="text-sm font-normal text-slate-500">
                em consultório / banho
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#ffedd5] text-[#c2410c] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PawPrint className="w-5 h-5 fill-current" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Hourglass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Tempo médio: <strong className="text-slate-800 font-semibold">{averageDurationMinutes} min</strong></span>
        </div>
      </div>

      {/* Card 3: CONCLUÍDOS HOJE */}
      <div 
        onClick={() => onFilterClick && onFilterClick(activeStatusFilter === 'concluido' ? 'todos' : 'concluido')}
        className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer group shadow-xs hover:shadow-md ${
          activeStatusFilter === 'concluido' ? 'border-[#006c49] ring-2 ring-[#006c49]/10' : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              CONCLUÍDOS HOJE
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tabular-nums tracking-tight">
                {completedCount}
              </span>
              <span className="text-sm font-normal text-slate-500">
                {completedCount === 1 ? 'procedimento' : 'procedimentos'}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span><strong className="text-emerald-700 font-semibold">{completionRate}%</strong> concluídos hoje</span>
        </div>
      </div>

      {/* Card 4: PRÓXIMAS VACINAÇÕES */}
      <div 
        onClick={() => onFilterClick && onFilterClick('todos')}
        className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer group shadow-xs hover:shadow-md"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              PRÓXIMAS VACINAÇÕES
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tabular-nums tracking-tight">
                {vaccinesPendingCount}
              </span>
              <span className="text-sm font-normal text-slate-500">
                {vaccinesPendingCount === 1 ? 'lembrete ativo' : 'lembretes ativos'}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Syringe className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span><strong className="text-slate-800 font-semibold">{vaccinesPendingCount}</strong> com aviso WhatsApp</span>
        </div>
      </div>
    </div>
  );
};
