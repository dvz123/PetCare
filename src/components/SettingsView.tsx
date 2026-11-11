import React, { useState } from 'react';
import { Building2, Stethoscope, Users, BellRing, Save, Check, Scissors, Syringe, Clock, Database, Copy, CheckCheck, ShieldCheck, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsViewProps {
  onResetDefaults?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetDefaults }) => {
  const { isConfigured, user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [copiedMigration, setCopiedMigration] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [clinicName, setClinicName] = useState('PetCare Clínica & Estética Animal');
  const [address, setAddress] = useState('Alameda dos Pets, 450 - Jardins, São Paulo - SP');
  const [phone, setPhone] = useState('(11) 3456-7890');
  const [whatsapp, setWhatsapp] = useState('(11) 98765-4321');
  const [autoReminder, setAutoReminder] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyMigrationPath = () => {
    navigator.clipboard.writeText('/supabase/migrations/20261110_init_petcare_schema.sql');
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
          Configurações da Clínica
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Gerencie dados institucionais, catálogo de serviços, integração Supabase e parâmetros de notificações automáticas.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configurações salvas e aplicadas com sucesso em todo o sistema!</span>
        </div>
      )}

      {/* Supabase Integration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006c49] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Integração Supabase & Banco de Dados
              </h3>
              <p className="text-xs text-slate-500">
                Autenticação de usuários, Row Level Security (RLS) e PostgreSQL em tempo real
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isConfigured 
              ? 'bg-emerald-100 text-[#047857]' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {isConfigured ? '● Conectado à Nuvem' : '● Modo Híbrido / Demo'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-800 block">Status da Autenticação</span>
            <p className="text-slate-600 leading-relaxed">
              Usuário autenticado: <strong className="text-slate-900">{user?.name}</strong> ({user?.email})
            </p>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sessão ativa com permissões de {user?.role}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-800 block">Arquivo de Migrations SQL</span>
            <p className="text-slate-600 font-mono text-[11px] truncate">
              /supabase/migrations/20261110_init_petcare_schema.sql
            </p>
            <button
              onClick={handleCopyMigrationPath}
              className="inline-flex items-center gap-1.5 text-xs text-[#006c49] hover:underline font-semibold"
            >
              {copiedMigration ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMigration ? 'Caminho copiado!' : 'Copiar caminho da migration'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#f8fafc] rounded-xl border border-slate-200 text-xs space-y-2">
          <span className="font-semibold text-slate-800">Tabelas e Políticas Configuradas na Migration:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <span className="p-2 bg-white rounded-lg border border-slate-200 font-mono">public.profiles</span>
            <span className="p-2 bg-white rounded-lg border border-slate-200 font-mono">public.tutors</span>
            <span className="p-2 bg-white rounded-lg border border-slate-200 font-mono">public.pets</span>
            <span className="p-2 bg-white rounded-lg border border-slate-200 font-mono">public.appointments</span>
            <span className="p-2 bg-white rounded-lg border border-slate-200 font-mono">public.vaccines</span>
            <span className="p-2 bg-white rounded-lg border border-slate-200 font-mono">public.clinical_history</span>
          </div>
        </div>
      </div>

      {/* Clinic Details Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-[#006c49]" />
          <h3 className="font-display font-bold text-base text-slate-900">Dados da Unidade</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome Fantasia da Clínica
            </label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Responsável Técnico (RT)
            </label>
            <input
              type="text"
              disabled
              value={user?.crmv ? `${user.name} (${user.crmv})` : 'Dra. Camila Ramos (CRMV-SP 48.291)'}
              className="w-full px-3.5 py-2 text-xs bg-slate-100 text-slate-600 rounded-xl border border-slate-200 cursor-not-allowed"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Endereço Completo
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telefone Fixo
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp da Recepção
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none tabular-nums"
            />
          </div>
        </div>

        {/* Reminders section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Lembretes Automáticos de Consulta e Vacina
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Disparar alertas e confirmações de presença via WhatsApp 24 horas antes do horário.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoReminder}
                onChange={(e) => setAutoReminder(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006c49]"></div>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#006c49] hover:bg-[#005236] transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>

      {/* Services and Pricing Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-[#006c49]" />
            <h3 className="font-display font-bold text-base text-slate-900">Catálogo de Serviços & Tabela de Preços</h3>
          </div>
          <span className="text-xs text-slate-400">4 especialidades ativas</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <strong className="text-slate-900 font-semibold block">Banho & Tosa Completa</strong>
              <span className="text-slate-500">Corte higiênico, escovação dental, hidratação e tosa geral</span>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">R$ 160,00</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <strong className="text-slate-900 font-semibold block">Vacina V10 Canina + Raiva Nobivac</strong>
              <span className="text-slate-500">Imunização completa anual com exame clínico prévio</span>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">R$ 195,00</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <strong className="text-slate-900 font-semibold block">Consulta Clínica Geral & Exame Físico</strong>
              <span className="text-slate-500">Avaliação com Dra. Camila Ramos ou Dr. Bruno Silveira</span>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">R$ 180,00</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <strong className="text-slate-900 font-semibold block">Profilaxia Odontológica (Limpeza de Tártaro)</strong>
              <span className="text-slate-500">Ultrassom odontológico com anestesia inalatória</span>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">R$ 450,00</span>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-slate-600" />
            <h3 className="font-display font-bold text-base text-slate-900">Gerenciamento de Dados Locais</h3>
          </div>
          <span className="text-xs text-slate-400">4 agendamentos padrão</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Seus dados e alterações ficam salvos localmente e podem ser integrados à nuvem via Supabase. Se você quiser limpar dados de testes e redefinir a grade para os 4 atendimentos padrão (Thor, Mia, Pipoca e Bento), utilize a opção abaixo:
        </p>

        {showResetConfirm ? (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Confirmar restauração da base para os 4 agendamentos padrão?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onResetDefaults) onResetDefaults();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold text-xs shadow-xs"
              >
                Sim, Restaurar 4 Agendamentos
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Redefinir para 4 Agendamentos Padrão</span>
          </button>
        )}
      </div>
    </div>
  );
};
