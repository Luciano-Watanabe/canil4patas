
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Client } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

const ClientManager: React.FC = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      const newClient: Client = { id: new Date().toISOString(), name, phone };
      setClients([...clients, newClient]);
      setName('');
      setPhone('');
    }
  };

  const handleDeleteClient = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este cliente?')) {
        setClients(clients.filter(client => client.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h3 className="text-xl font-bold text-brand-dark mb-4">Adicionar Novo Cliente</h3>
        <form onSubmit={handleAddClient} className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <div>
            <label htmlFor="client-name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="Nome do Cliente"
            />
          </div>
          <div>
            <label htmlFor="client-phone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              id="client-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="(11) 99999-9999"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Adicionar Cliente
          </button>
        </form>
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold text-brand-dark mb-4">Lista de Clientes ({clients.length})</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          {clients.length > 0 ? (
            <ul className="space-y-3">
              {clients.map(client => (
                <li key={client.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.phone}</p>
                  </div>
                  <button onClick={() => handleDeleteClient(client.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum cliente cadastrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
