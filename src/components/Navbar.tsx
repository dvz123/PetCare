import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  PawPrint,
  Users,
  History,
  Plus,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { ClinicNotification } from '../types/crm';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  activeTab: 'agenda' | 'clientes' | 'historico' | 'config';
  onTabChange: (tab: 'agenda' | 'clientes' | 'historico' | 'config') => void;
  notifications: ClinicNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onGlobalSearch: (term: string) => void;
  globalSearchQuery: string;
  onOpenNewAppointment?: () => void;
  onOpenLoginModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  notifications,
  onMarkNotificationAsRead,
  onGlobalSearch,
  globalSearchQuery,
  onOpenNewAppointment,
  onOpenLoginModal,
}) => {
  const { user, signOut, isConfigured } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSelectMobileTab = (tab: 'agenda' | 'clientes' | 'historico' | 'config') => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'veterinario':
        return 'Médica Veterinária';
      case 'recepcionista':
        return 'Recepção Clínica';
      case 'esteticista':
        return 'Esteticista Pet';
      case 'administrador':
        return 'Administrador';
      default:
        return 'Equipe PetCare';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 transition-shadow">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Mark */}
          <div 
            onClick={() => onTabChange('agenda')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#006c49] to-[#10b981] flex items-center justify-center text-white shadow-sm shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <PawPrint className="w-5 h-5 fill-white/90" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#0F172A]">
                  PetCare
                </span>
                <span className="font-display font-semibold text-lg sm:text-xl tracking-tight text-[#006c49]">
                  CRM
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onTabChange('agenda')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'agenda'
                  ? 'text-[#006c49] bg-emerald-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Atendimentos & Agenda
            </button>
            <button
              onClick={() => onTabChange('clientes')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'clientes'
                  ? 'text-[#006c49] bg-emerald-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Clientes & Pets
            </button>
            <button
              onClick={() => onTabChange('historico')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'historico'
                  ? 'text-[#006c49] bg-emerald-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => onTabChange('config')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'config'
                  ? 'text-[#006c49] bg-emerald-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Configurações
            </button>
          </nav>
        </div>

        {/* Right Zone: Search, Bell, Profile */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end max-w-2xl">
          {/* Quick Search (Desktop) */}
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => onGlobalSearch(e.target.value)}
              placeholder="Buscar tutor, pet ou prontuário..."
              className="w-full pl-10 pr-4 py-2 bg-[#f2f4f6] hover:bg-[#eceef0] focus:bg-white text-sm text-slate-800 placeholder-slate-500 rounded-full border border-transparent focus:border-[#006c49]/30 focus:ring-2 focus:ring-[#006c49]/10 outline-none transition-all"
            />
            {globalSearchQuery && (
              <button
                onClick={() => onGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 sm:p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">Notificações Clínicas</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {unreadCount} novas
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => notifications.forEach(n => onMarkNotificationAsRead(n.id))}
                    className="text-xs text-[#006c49] hover:underline"
                  >
                    Marcar lidas
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-1">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => onMarkNotificationAsRead(n.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${
                        n.read ? 'hover:bg-slate-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
                      }`}
                    >
                      <div className="mt-0.5 w-2 h-2 rounded-full shrink-0 bg-[#006c49]"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900">{n.title}</div>
                        <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.description}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{n.timeAgo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Supabase Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 sm:gap-3 p-1 rounded-full hover:bg-slate-100/80 transition-colors text-left"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs sm:text-sm font-semibold text-[#0F172A] leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-tight">
                    {getRoleLabel(user.role)}
                  </div>
                </div>
                <div className="relative shrink-0">
                  <img
                    src={user.avatarUrl || '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg'}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {isConfigured ? 'Supabase Auth' : 'Sessão Ativa'}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.crmv || user.email}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{getRoleLabel(user.role)}</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { onTabChange('agenda'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Minha Escala de Hoje
                    </button>
                    <button 
                      onClick={() => { onTabChange('config'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <SettingsIcon className="w-4 h-4 text-slate-400" />
                      Configurações da Clínica
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    <button 
                      onClick={async () => {
                        setShowUserMenu(false);
                        await signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sair da Conta (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#006c49] hover:bg-[#005236] transition-colors shadow-2xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER / MENU PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Mobile User Card */}
          {user && (
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatarUrl || '/src/assets/images/avatar_camila_veterinaria_1794358059183.jpg'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-500">{getRoleLabel(user.role)}</div>
                </div>
              </div>
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await signOut();
                }}
                className="text-xs text-red-600 hover:underline font-medium"
              >
                Sair
              </button>
            </div>
          )}

          {/* Mobile Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => onGlobalSearch(e.target.value)}
              placeholder="Buscar tutor, pet ou prontuário..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#006c49]"
            />
          </div>

          {/* Navigation Links in Mobile */}
          <nav className="flex flex-col gap-1 pt-1">
            <button
              onClick={() => handleSelectMobileTab('agenda')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'agenda' ? 'bg-emerald-50 text-[#006c49]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Atendimentos & Agenda Diária</span>
            </button>
            <button
              onClick={() => handleSelectMobileTab('clientes')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'clientes' ? 'bg-emerald-50 text-[#006c49]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes & Pacientes Pets (CRUD)</span>
            </button>
            <button
              onClick={() => handleSelectMobileTab('historico')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'historico' ? 'bg-emerald-50 text-[#006c49]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico de Procedimentos</span>
            </button>
            <button
              onClick={() => handleSelectMobileTab('config')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'config' ? 'bg-emerald-50 text-[#006c49]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Configurações da Clínica</span>
            </button>
          </nav>

          {/* Mobile Quick Action button */}
          {onOpenNewAppointment && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onOpenNewAppointment();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#10b981] hover:bg-[#059669] shadow-xs"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Novo Agendamento</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
