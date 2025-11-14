import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/firebaseService';
import { CogIcon } from './icons/CogIcon';
import { Settings } from '../types';

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({ whatsappNumber: '', messagingApiUrl: '', messagingApiToken: '' });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const settingsData = await getSettings();
      // Garante valores padrão se os campos estiverem faltando no Firestore
      setSettings({
        whatsappNumber: settingsData.whatsappNumber || '',
        messagingApiUrl: settingsData.messagingApiUrl || 'http://portal.masterdaweb.net:8081/chat/send/text',
        messagingApiToken: settingsData.messagingApiToken || '12C184450FCF4C9B_CA',
      });
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
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
        <form onSubmit={handleSave} className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                    Número de WhatsApp para Contato (Público)
                </label>
                <p className="text-xs text-gray-500 mb-2">Usado nos botões 'Tenho Interesse' e formulários de contato do site público.</p>
                <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
                    placeholder="Ex: 5511912345678"
                />
            </div>
            
            <hr />

            <div>
                <label htmlFor="messagingApiUrl" className="block text-sm font-medium text-gray-700">
                    URL da API de Envio de Mensagens
                </label>
                <p className="text-xs text-gray-500 mb-2">Endpoint completo que será usado para enviar as mensagens via API.</p>
                <input
                    type="url"
                    id="messagingApiUrl"
                    name="messagingApiUrl"
                    value={settings.messagingApiUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
                    placeholder="http://exemplo.com/api/send-text"
                />
                 {window.location.protocol === 'https:' && settings.messagingApiUrl?.startsWith('http:') && (
                    <div className="mt-2 text-xs text-yellow-800 bg-yellow-100 p-2 rounded-md">
                        <strong>Atenção:</strong> Usar uma URL <code className="bg-yellow-200 px-1 rounded">http://</code> em um site seguro <code className="bg-yellow-200 px-1 rounded">https://</code> provavelmente causará um erro de "Conteúdo Misto" e impedirá o envio de mensagens.
                    </div>
                )}
            </div>

             <div>
                <label htmlFor="messagingApiToken" className="block text-sm font-medium text-gray-700">
                    Token da API
                </label>
                <p className="text-xs text-gray-500 mb-2">Token de autenticação enviado no cabeçalho 'token'.</p>
                <input
                    type="text"
                    id="messagingApiToken"
                    name="messagingApiToken"
                    value={settings.messagingApiToken}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
                    placeholder="Cole seu token aqui"
                />
            </div>
            
            <div className="flex items-center gap-4 pt-2">
                 <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition-colors"
                >
                    Salvar Configurações
                </button>
                {saved && (
                    <p className="text-sm text-green-700 animate-pulse">Configurações salvas com sucesso!</p>
                )}
            </div>
        </form>
    </div>
  );
};

export default SettingsManager;