import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/firebaseService';
import { CogIcon } from './icons/CogIcon';

const SettingsManager: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const settings = await getSettings();
      setWhatsappNumber(settings.whatsappNumber);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({ whatsappNumber });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <p>Carregando configurações...</p>;
  }

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
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
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