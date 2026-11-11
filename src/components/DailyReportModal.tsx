import React from 'react';
import { X, Download, Printer, TrendingUp, CheckCircle, Clock, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Appointment } from '../types/crm';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({
  isOpen,
  onClose,
  appointments,
}) => {
  if (!isOpen) return null;

  const totalToday = appointments.filter(a => a.scheduledDateLabel === 'Hoje').length;
  const completedToday = appointments.filter(a => a.status === 'concluido').length;
  const inProgressToday = appointments.filter(a => a.status === 'em_atendimento').length;
  const scheduledToday = appointments.filter(a => a.status === 'agendado').length;

  const completionPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 100;
  const inProgressList = appointments.filter(a => a.status === 'em_atendimento');
  const avgMinutes = inProgressList.length > 0 
    ? Math.round(inProgressList.reduce((acc, curr) => acc + (curr.durationMinutes || 45), 0) / inProgressList.length) 
    : 35;

  const totalRevenue = appointments
    .filter(a => a.status === 'concluido')
    .reduce((acc, curr) => acc + curr.price, 0);

  const categories = {
    estetica: appointments.filter(a => a.serviceCategory === 'estetica').length,
    clinica: appointments.filter(a => a.serviceCategory === 'clinica').length,
    vacina: appointments.filter(a => a.serviceCategory === 'vacina').length,
    odonto: appointments.filter(a => a.serviceCategory === 'odonto').length,
  };

  const handleExportCSV = () => {
    const csvHeader = "ID,Tutor,Telefone,Pet,Espécie,Serviço,Horário,Status,Valor (R$)\n";
    const csvRows = appointments.map(a => 
      `"${a.id}","${a.tutorName}","${a.tutorPhone}","${a.petName}","${a.petSpecies}","${a.serviceName}","${a.scheduledTime}","${a.status}","${a.price.toFixed(2)}"`
    ).join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_petcare_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006c49] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Relatório Operacional Diário</h3>
              <p className="text-xs text-slate-500">Métricas consolidadas de produtividade clínica e estética</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Key Figures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Hoje</span>
              <span className="text-2xl font-bold font-display text-slate-900 tabular-nums block mt-1">{totalToday} pets</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Na grade</span>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Concluídos</span>
              <span className="text-2xl font-bold font-display text-emerald-800 tabular-nums block mt-1">{completedToday}</span>
              <span className="text-[11px] text-emerald-600 mt-0.5 block">{completionPercent}% concluídos</span>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Em Curso</span>
              <span className="text-2xl font-bold font-display text-amber-800 tabular-nums block mt-1">{inProgressToday}</span>
              <span className="text-[11px] text-amber-600 mt-0.5 block">Média {avgMinutes} min</span>
            </div>
            <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
              <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider block">Receita Concluída</span>
              <span className="text-xl font-bold font-display text-sky-900 tabular-nums block mt-1">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-sky-600 mt-0.5 block">Faturamento</span>
            </div>
          </div>

          {/* Breakdown by Service */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Distribuição por Especialidade
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Banho & Tosa / Estética Animal ({categories.estetica})</span>
                  <span>{Math.round((categories.estetica / (appointments.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full" 
                    style={{ width: `${(categories.estetica / (appointments.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Consultas Clínicas Gerais ({categories.clinica})</span>
                  <span>{Math.round((categories.clinica / (appointments.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-[#10b981] rounded-full" 
                    style={{ width: `${(categories.clinica / (appointments.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Vacinações & Imunizações ({categories.vacina})</span>
                  <span>{Math.round((categories.vacina / (appointments.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${(categories.vacina / (appointments.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Odontologia & Procedimentos Especiais ({categories.odonto})</span>
                  <span>{Math.round((categories.odonto / (appointments.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${(categories.odonto / (appointments.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-[#fbfcfc] flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#006c49] hover:bg-[#005236] rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Dados (CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
