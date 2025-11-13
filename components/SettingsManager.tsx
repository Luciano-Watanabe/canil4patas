import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WHATSAPP_NUMBER } from '../constants';
import { CogIcon } from './icons/CogIcon';

const SettingsManager: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useLocalStorage<string>('whatsappNumber', WHATSAPP_NUMBER);
  const [tempNumber, setTempNumber] = useState(whatsappNumber);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappNumber(tempNumber);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
            <CogIcon className="w-6 h-6" />
            Configurações Gerais
        </h3>
        <form onSubmit={handleSave} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
                <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-700">
                    Número de WhatsApp para Contato
                </label>
                <p className="text-xs text-gray-500 mb-2">Este número será usado nos botões 'Tenho Interesse' e formulários de contato.</p>
                <input
                    type="tel"
                    id="whatsapp-number"
                    value={tempNumber}
                    onChange={(e) => setTempNumber(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
                    placeholder="Ex: 5511912345678"
                />
            </div>
            <div className="flex items-center gap-4">
                 <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition-colors"
                >
                    Salvar Número
                </button>
                {saved && (
                    <p className="text-sm text-green-700">Número salvo com sucesso!</p>
                )}
            </div>
        </form>
    </div>
  );
};

export default SettingsManager;
