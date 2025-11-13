import React, { useState, useEffect } from 'react';
import { Client, ScheduledMessage } from '../types';
import { getClients, getSchedules, addSchedule, deleteSchedule } from '../services/firebaseService';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

const Scheduler: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [schedules, setSchedules] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [sendAt, setSendAt] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [clientsData, schedulesData] = await Promise.all([getClients(), getSchedules()]);
    setClients(clientsData);
    setSchedules(schedulesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClients.length > 0 && message && sendAt) {
      const newSchedule: Omit<ScheduledMessage, 'id'> = {
        clientIds: selectedClients,
        message,
        sendAt,
      };
      await addSchedule(newSchedule);
      setSelectedClients([]);
      setMessage('');
      setSendAt('');
      await fetchData();
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este agendamento?')) {
        await deleteSchedule(id);
        await fetchData();
    }
  };

  const getClientNames = (clientIds: string[]) => {
    return clientIds.map(id => clients.find(c => c.id === id)?.name).filter(Boolean).join(', ');
  };

  return (
    <div>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
        <p className="font-bold">Aviso Importante</p>
        <p>Este é um agendador de interface. O envio real das mensagens no horário programado requer um serviço de backend (servidor) para ser executado. As mensagens não serão enviadas automaticamente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-brand-dark mb-4">Novo Agendamento</h3>
          <form onSubmit={handleAddSchedule} className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Clientes</label>
              <select
                multiple
                value={selectedClients}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClients(Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value))}
                className="mt-1 block w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="schedule-message" className="block text-sm font-medium text-gray-700">Mensagem</label>
              <textarea
                id="schedule-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              />
            </div>
            <div>
              <label htmlFor="schedule-datetime" className="block text-sm font-medium text-gray-700">Data e Hora do Envio</label>
              <input
                type="datetime-local"
                id="schedule-datetime"
                value={sendAt}
                onChange={(e) => setSendAt(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Agendar Mensagem
            </button>
          </form>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-brand-dark mb-4">Mensagens Agendadas ({schedules.length})</h3>
          <div className="bg-gray-50 p-4 rounded-lg max-h-[28rem] overflow-y-auto">
             {loading ? (
                <p className="text-center text-gray-500 py-8">Carregando agendamentos...</p>
             ) : schedules.length > 0 ? (
              <ul className="space-y-3">
                {schedules.map(schedule => (
                  <li key={schedule.id} className="bg-white p-4 rounded-md shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Para: <span className="font-normal">{getClientNames(schedule.clientIds)}</span>
                        </p>
                        <p className="font-semibold text-gray-800">
                          Quando: <span className="font-normal text-brand-primary">{new Date(schedule.sendAt).toLocaleString('pt-BR')}</span>
                        </p>
                        <p className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded-md italic">"{schedule.message}"</p>
                      </div>
                      <button onClick={() => handleDeleteSchedule(schedule.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors flex-shrink-0 ml-4">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhuma mensagem agendada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;