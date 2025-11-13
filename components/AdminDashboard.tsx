
import React, { useState } from 'react';
import ClientManager from './ClientManager';
import MessageComposer from './MessageComposer';
import Scheduler from './Scheduler';
import SettingsManager from './SettingsManager';
import CatalogManager from './CatalogManager';
import { UsersIcon } from './icons/UsersIcon';
import { MessageIcon } from './icons/MessageIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CogIcon } from './icons/CogIcon';
import { ListIcon } from './icons/ListIcon';

type AdminTab = 'catalog' | 'clients' | 'messages' | 'scheduler' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('catalog');

  const renderContent = () => {
    switch (activeTab) {
      case 'catalog':
        return <CatalogManager />;
      case 'clients':
        return <ClientManager />;
      case 'messages':
        return <MessageComposer />;
      case 'scheduler':
        return <Scheduler />;
      case 'settings':
        return <SettingsManager />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: AdminTab, label: string, icon: React.FC<{className: string}> }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-semibold transition-colors duration-200 focus:outline-none ${
          isActive
            ? 'bg-white text-brand-primary border-b-2 border-brand-primary'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-brand-dark mb-6">Painel do Administrador</h2>
      <div className="flex flex-wrap border-b border-gray-200">
        <TabButton tab="catalog" label="Gerenciar Catálogo" icon={ListIcon} />
        <TabButton tab="clients" label="Gerenciar Clientes" icon={UsersIcon} />
        <TabButton tab="messages" label="Enviar Mensagens" icon={MessageIcon} />
        <TabButton tab="scheduler" label="Agendador" icon={ClockIcon} />
        <TabButton tab="settings" label="Configurações" icon={CogIcon} />
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;