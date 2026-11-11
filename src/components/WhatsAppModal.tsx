import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, ExternalLink, Send } from 'lucide-react';
import { Appointment } from '../types/crm';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const [copied, setCopied] = useState(false);
  const [customText, setCustomText] = useState('');

  if (!isOpen || !appointment) return null;

  const defaultMessage = `Olá, ${appointment.tutorName}! 🐾\nPassando para confirmar o agendamento de ${appointment.petName} (${appointment.serviceName}) hoje às ${appointment.scheduledTime} na Clínica & Estética PetCare.\n\nEndereço: Alameda dos Pets, 450 - Jardins\n\nCaso tenha algum imprevisto, basta nos responder por aqui. Até logo! 🐶✨`;

  const messageToSend = customText || defaultMessage;
  const cleanPhone = appointment.tutorPhone.replace(/\D/g, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(messageToSend);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageToSend);
    const url = `https://wa.me/55${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-[#f0fdf4]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Lembrete WhatsApp
              </h3>
              <p className="text-xs text-slate-500">
                Destinatário: <strong className="text-slate-700">{appointment.tutorName}</strong> ({appointment.tutorPhone})
              </p>
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Mensagem Personalizada Automática
            </label>
            <textarea
              rows={6}
              value={customText || defaultMessage}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3.5 text-xs text-slate-800 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-[#006c49] outline-none resize-none leading-relaxed font-sans"
            ></textarea>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lembretes pré-atendimento reduzem faltas e atrasos em mais de 65%.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-[#fbfcfc] flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#10b981] hover:bg-[#059669] rounded-xl shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
