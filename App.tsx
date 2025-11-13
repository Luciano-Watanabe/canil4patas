import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PublicCatalog from './components/PublicCatalog';
import Header from './components/Header';
import { DogPawIcon } from './components/icons/DogPawIcon';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminView, setAdminView] = useState<'dashboard' | 'catalog'>('dashboard');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminView('dashboard');
  };

  const Footer = () => (
     <footer className="text-center p-4 bg-white border-t border-gray-200 mt-8">
        <div className="flex items-center justify-center gap-2">
           <DogPawIcon className="w-6 h-6 text-brand-primary" />
           <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Canil - Meus Filhos de 4 Patas. Todos os direitos reservados.</p>
        </div>
      </footer>
  );

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-light font-sans text-brand-dark">
        <Header
          isAuthenticated={true}
          currentAdminView={adminView}
          setAdminView={setAdminView}
          onLogout={handleLogout}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {adminView === 'dashboard' ? <AdminDashboard /> : <PublicCatalog />}
        </main>
        <Footer />
      </div>
    );
  }

  if (showLogin) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setShowLogin(false);
        }}
        onBack={() => setShowLogin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-light font-sans text-brand-dark">
      <Header
        isAuthenticated={false}
        onAdminClick={() => setShowLogin(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <PublicCatalog />
      </main>
      <Footer />
    </div>
  );
}
