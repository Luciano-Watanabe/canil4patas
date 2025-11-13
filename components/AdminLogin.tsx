import React, { useState } from 'react';
import { ADMIN_PASSWORD } from '../constants';
import { DogPawIcon } from './icons/DogPawIcon';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <DogPawIcon className="w-16 h-16 text-brand-primary mb-4" />
          <h2 className="text-3xl font-extrabold text-center text-brand-dark">
            Área Restrita do Admin
          </h2>
          <p className="text-center text-gray-600">
            A senha padrão é 'admin'.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="password-admin" className="sr-only">
              Senha
            </label>
            <input
              id="password-admin"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm"
              placeholder="Senha"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
         <div className="text-center">
            <button
              onClick={onBack}
              className="font-medium text-sm text-brand-primary hover:text-brand-dark transition-colors"
            >
              Voltar para o site
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
