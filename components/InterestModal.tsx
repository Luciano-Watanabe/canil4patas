import React, { useState } from 'react';
import { Dog } from '../types';

interface InterestModalProps {
  dog: Dog;
  onClose: () => void;
  whatsappNumber: string;
}

const InterestModal: React.FC<InterestModalProps> = ({ dog, onClose, whatsappNumber }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Por favor, preencha seu nome e telefone.');
      return;
    }
    const message = encodeURIComponent(
      `Olá! Tenho interesse no cãozinho ${dog.name} (${dog.breed}). Meu nome é ${name} e meu telefone é ${phone}.`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="interest-modal-title"
    >
      <div 
        className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl font-bold"
          aria-label="Fechar modal"
        >
          &times;
        </button>
        
        <div className="text-center">
            <img src={dog.imageUrl} alt={dog.name} className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-brand-light" />
            <h2 id="interest-modal-title" className="text-2xl font-bold text-brand-dark mb-2">Interesse em {dog.name}</h2>
            <p className="text-gray-600 mb-6">
                Ótima escolha! Preencha seus dados abaixo para entrarmos em contato via WhatsApp.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="modal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700">Telefone (com DDD)</label>
            <input
              type="tel"
              id="modal-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
              placeholder="Ex: 11912345678"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
          >
            Enviar Interesse via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterestModal;