import React from 'react';
import { DogPawIcon } from './icons/DogPawIcon';

interface HeaderProps {
  isAuthenticated: boolean;
  currentAdminView?: 'dashboard' | 'catalog';
  setAdminView?: (view: 'dashboard' | 'catalog') => void;
  onLogout?: () => void;
  onAdminClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  currentAdminView,
  setAdminView,
  onLogout,
  onAdminClick,
}) => {
  const activeClass = 'bg-brand-primary text-white';
  const inactiveClass = 'bg-white text-brand-primary hover:bg-brand-light';

  return (
    <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        <DogPawIcon className="w-10 h-10 text-brand-primary" />
        <h1 className="text-2xl font-bold text-brand-dark">Canil - Meus Filhos de 4 Patas</h1>
      </div>
      <nav className="flex gap-2">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setAdminView && setAdminView('catalog')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${currentAdminView === 'catalog' ? activeClass : inactiveClass}`}
            >
              Ver Catálogo
            </button>
            <button
              onClick={() => setAdminView && setAdminView('dashboard')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${currentAdminView === 'dashboard' ? activeClass : inactiveClass}`}
            >
              Painel Admin
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-red-600 text-white hover:bg-red-800"
            >
              Sair
            </button>
          </>
        ) : (
          <button
            onClick={onAdminClick}
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${inactiveClass}`}
          >
            Área do Admin
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
