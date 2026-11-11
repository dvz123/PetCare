import React, { useState } from 'react';
import { 
  PawPrint, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { signIn, signUp, demoSignIn, forceSignIn, isConfigured } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register extra fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<'veterinario' | 'recepcionista' | 'esteticista' | 'administrador'>('veterinario');
  const [crmv, setCrmv] = useState('CRMV-SP ');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error);
        } else if (onSuccess) {
          onSuccess();
        }
      } else {
        if (!name.trim()) {
          setErrorMessage('Informe seu nome completo.');
          setLoading(false);
          return;
        }
        const { error } = await signUp(
          name, 
          email, 
          password, 
          role, 
          role === 'veterinario' ? crmv : undefined
        );
        if (error) {
          setErrorMessage(error);
        } else if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao processar a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (preset: 'camila' | 'recepcao' | 'lucas') => {
    demoSignIn(preset);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006c49] to-[#10b981] text-white shadow-md shadow-emerald-900/15 mb-1">
            <PawPrint className="w-7 h-7 fill-white/90" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#0F172A]">
              PetCare
            </h1>
            <span className="font-display font-semibold text-2xl sm:text-3xl tracking-tight text-[#006c49]">
              CRM
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Acesse o sistema de gestão clínica veterinária, estética e atendimento ao paciente.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6">
          {/* Tabs: Login vs Register */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Acessar Conta
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Novo Cadastro
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-800 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block text-red-900">
                    {errorMessage.toLowerCase().includes('rate limit')
                      ? 'Limite de E-mails do Supabase Atingido (Email Rate Limit)'
                      : errorMessage}
                  </span>
                  {errorMessage.toLowerCase().includes('rate limit') && (
                    <p className="text-[11px] text-red-700 mt-1 leading-relaxed">
                      O servidor de e-mail padrão do Supabase gratuito limita o envio para apenas 3 a 4 confirmações por hora para evitar spam.
                    </p>
                  )}
                </div>
              </div>

              {errorMessage.toLowerCase().includes('rate limit') && (
                <div className="pt-2 border-t border-red-200/70 space-y-2">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-red-100 text-[11px] text-slate-700 space-y-1">
                    <strong className="text-slate-900 block font-semibold">Como resolver no painel do Supabase:</strong>
                    <p>1. Vá em <strong>Authentication &gt; Providers &gt; Email</strong></p>
                    <p>2. Desmarque a opção <strong>"Confirm email"</strong> (para criar usuários sem envio de e-mail) e salve.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      forceSignIn({
                        name: name.trim() || 'Davi',
                        email: email.trim() || 'davi@petcare.com',
                        role,
                        crmv: role === 'veterinario' ? crmv : undefined,
                      });
                      if (onSuccess) onSuccess();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Entrar agora como {name.trim() || 'Davi'} (Sem esperar e-mail)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Dra. Camila Ramos"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Função na Clínica *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                    >
                      <option value="veterinario">Veterinário(a)</option>
                      <option value="recepcionista">Recepcionista</option>
                      <option value="esteticista">Esteticista Pet</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>

                  {role === 'veterinario' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CRMV Oficial
                      </label>
                      <input
                        type="text"
                        value={crmv}
                        onChange={(e) => setCrmv(e.target.value)}
                        placeholder="CRMV-SP 00.000"
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Profissional *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="camila.ramos@petcare.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Senha de Acesso *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Para redefinir a senha, utilize o painel do Supabase Auth ou solicite ao administrador.')}
                    className="text-[11px] text-[#006c49] hover:underline"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-[#006c49] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#006c49] hover:bg-[#005236] transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar no Sistema' : 'Concluir Cadastro'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo 1-Click Access Box */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Acesso Rápido para Teste</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                1-Clique
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('camila')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#006c49] hover:bg-emerald-50/50 text-left transition-all group"
              >
                <div className="font-semibold text-xs text-slate-900 group-hover:text-[#006c49]">
                  Dra. Camila Ramos
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Médica Veterinária (RT)
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('recepcao')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#006c49] hover:bg-emerald-50/50 text-left transition-all group"
              >
                <div className="font-semibold text-xs text-slate-900 group-hover:text-[#006c49]">
                  Recepção Clínica
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Agendamentos & Check-in
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Supabase Status Footer Card */}
        <div className="p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#006c49] shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 block">
                {isConfigured ? 'Supabase Conectado' : 'Pronto para Supabase'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isConfigured 
                  ? 'Autenticação e RLS ativos no projeto Supabase.' 
                  : 'Migrations geradas em /supabase/migrations/.'}
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
            isConfigured 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {isConfigured ? 'Nuvem Ativa' : 'Modo Híbrido'}
          </span>
        </div>
      </div>
    </div>
  );
};
