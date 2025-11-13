import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { getClients } from '../services/firebaseService';
import { generateMessageIdea } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

const MessageComposer: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoadingIdea, setIsLoadingIdea] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
        setLoadingClients(true);
        const clientsFromDb = await getClients();
        setClients(clientsFromDb);
        setLoadingClients(false);
    };
    fetchClients();
  }, []);

  const handleGenerateIdea = async () => {
    setIsLoadingIdea(true);
    const idea = await generateMessageIdea();
    setMessage(idea);
    setIsLoadingIdea(false);
  };

  const handleSendMessage = () => {
    if (selectedClients.length === 0 || !message) {
      setSendStatus('Por favor, selecione pelo menos um cliente e escreva uma mensagem.');
      return;
    }
    const messageText = encodeURIComponent(message);
    
    const firstClient = clients.find(c => c.id === selectedClients[0]);
    if (firstClient) {
      const whatsappUrl = `https://wa.me/${firstClient.phone.replace(/\D/g, '')}?text=${messageText}`;
      window.open(whatsappUrl, '_blank');
      setSendStatus(`Simulação de envio para ${selectedClients.length} cliente(s) concluída. Uma aba do WhatsApp foi aberta para ${firstClient.name}.`);
    } else {
      setSendStatus('Erro: cliente selecionado não encontrado.');
    }

    setMessage('');
    setSelectedClients([]);
    setTimeout(() => setSendStatus(null), 5000);
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
              disabled={isLoadingIdea}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-brand-secondary text-brand-primary rounded-md shadow-sm text-sm font-medium bg-white hover:bg-brand-light transition-colors disabled:opacity-50"
            >
              <SparklesIcon className="w-5 h-5"/>
              {isLoadingIdea ? 'Gerando...' : 'Gerar Ideia com IA'}
            </button>
            <button
              onClick={handleSendMessage}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition-colors"
            >
              Enviar Mensagem
            </button>
          </div>
          {sendStatus && <p className="text-sm text-green-700 bg-green-100 p-3 rounded-md">{sendStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;