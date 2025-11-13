import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PublicCatalog from './components/PublicCatalog';
import Header from './components/Header';
import { DogPawIcon } from './components/icons/DogPawIcon';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [adminView, setAdminView] = useState<'dashboard' | 'catalog'>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O onAuthStateChanged vai atualizar isAuthenticated para false automaticamente
      setAdminView('dashboard');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const Footer = () => (
     <footer className="text-center p-4 bg-white border-t border-gray-200 mt-8">
        <div className="flex items-center justify-center gap-2">
           <DogPawIcon className="w-6 h-6 text-brand-primary" />
           <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Canil - Meus Filhos de 4 Patas. Todos os direitos reservados.</p>
        </div>
      </footer>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <DogPawIcon className="w-16 h-16 text-brand-primary animate-pulse" />
      </div>
    );
  }

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
          // O onAuthStateChanged cuidará da atualização do estado
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