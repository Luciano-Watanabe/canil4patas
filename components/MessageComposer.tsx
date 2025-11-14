import React, { useState, useEffect } from 'react';
import { Client, Settings } from '../types';
import { getClients, getSettings } from '../services/firebaseService';
import { generateMessageIdea } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

const MessageComposer: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoadingIdea, setIsLoadingIdea] = useState(false);
  const [status, setStatus] = useState<{type: 'info' | 'error' | 'success', message: string} | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoadingClients(true);
        const [clientsFromDb, settingsFromDb] = await Promise.all([
          getClients(), 
          getSettings()
        ]);
        setClients(clientsFromDb);
        setSettings(settingsFromDb);
        setLoadingClients(false);
    };
    fetchData();
  }, []);

  const handleGenerateIdea = async () => {
    setIsLoadingIdea(true);
    const idea = await generateMessageIdea();
    setMessage(idea);
    setIsLoadingIdea(false);
  };

  const handleSendMessage = async () => {
    setStatus(null);
    if (selectedClients.length === 0 || !message) {
      setStatus({ type: 'error', message: 'Por favor, selecione pelo menos um cliente e escreva uma mensagem.' });
      return;
    }
    if (!settings?.messagingApiUrl) {
      setStatus({ type: 'error', message: 'A URL da API de mensagens não está configurada. Verifique as Configurações.' });
      return;
    }

    // Checagem de Conteúdo Misto (Mixed Content)
    if (window.location.protocol === 'https:' && settings.messagingApiUrl.startsWith('http:')) {
        setStatus({
            type: 'error',
            message: 'Erro de Conteúdo Misto: A aplicação (HTTPS) não pode se comunicar com uma API insegura (HTTP) por regras do navegador. Verifique a URL da API nas configurações.'
        });
        return; // Para a execução antes de tentar o fetch
    }

    setIsSending(true);
    const clientsToSend = clients.filter(c => selectedClients.includes(c.id));
    const totalClients = clientsToSend.length;
    let successCount = 0;
    const failedClients: string[] = [];

    for (let i = 0; i < totalClients; i++) {
      const client = clientsToSend[i];
      setStatus({ type: 'info', message: `Enviando ${i + 1}/${totalClients} para ${client.name}...` });
      
      try {
        const response = await fetch(settings.messagingApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            ...(settings.messagingApiToken && { 'token': settings.messagingApiToken }),
          },
          body: JSON.stringify({
            Phone: client.phone.replace(/\D/g, ''),
            Body: message,
            Id: crypto.randomUUID(),
            Presence: 3000,
            Duration: 86400,
            LinkPreview: true,
            NumberCheck: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`Falha na API com status ${response.status}`);
        }
        successCount++;
      } catch (error) {
        console.error(`Falha ao enviar para ${client.name}:`, error);
        failedClients.push(client.name);
      }
    }

    setIsSending(false);

    if (failedClients.length === 0) {
      setStatus({ type: 'success', message: `Todas as ${totalClients} mensagens foram enviadas com sucesso!` });
    } else {
      setStatus({ type: 'error', message: `Enviado para ${successCount}/${totalClients}. Falha para: ${failedClients.join(', ')}.` });
    }
    
    setMessage('');
    setSelectedClients([]);

    setTimeout(() => setStatus(null), 8000);
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedClients(clients.map(c => c.id));
    } else {
      setSelectedClients([]);
    }
  };
  
  const handleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const statusColors = {
      info: 'text-blue-700 bg-blue-100',
      success: 'text-green-700 bg-green-100',
      error: 'text-red-700 bg-red-100',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h3 className="text-xl font-bold text-brand-dark mb-4">Selecionar Clientes</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          {loadingClients ? (
             <p className="text-center text-gray-500 py-8">Carregando clientes...</p>
          ) : clients.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center border-b pb-2 mb-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedClients.length === clients.length && clients.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-secondary"
                />
                <label htmlFor="select-all" className="ml-3 block text-sm font-medium text-gray-900">
                  Selecionar Todos
                </label>
              </div>
              {clients.map(client => (
                <div key={client.id} className="flex items-center">
                  <input
                    id={`client-${client.id}`}
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => handleClientSelection(client.id)}
                    className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-secondary"
                  />
                  <label htmlFor={`client-${client.id}`} className="ml-3 text-sm text-gray-700">{client.name}</label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum cliente cadastrado.</p>
          )}
        </div>
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold text-brand-dark mb-4">Escrever Mensagem</h3>
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
            placeholder="Digite sua mensagem aqui..."
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleGenerateIdea}
              disabled={isLoadingIdea || isSending}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-brand-secondary text-brand-primary rounded-md shadow-sm text-sm font-medium bg-white hover:bg-brand-light transition-colors disabled:opacity-50"
            >
              <SparklesIcon className="w-5 h-5"/>
              {isLoadingIdea ? 'Gerando...' : 'Gerar Ideia com IA'}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </div>
          {status && (
            <p className={`text-sm p-3 rounded-md ${statusColors[status.type]}`}>
              {status.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;