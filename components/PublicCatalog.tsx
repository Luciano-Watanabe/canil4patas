import React, { useState, useEffect } from 'react';
import DogCard from './DogCard';
import { Dog } from '../types';
import InterestModal from './InterestModal';
import { getDogs, getSettings } from '../services/firebaseService';

const PublicCatalog: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dogsData, settingsData] = await Promise.all([getDogs(), getSettings()]);
        setDogs(dogsData);
        setWhatsappNumber(settingsData.whatsappNumber);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar o catálogo. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInterestClick = (dog: Dog) => {
    setSelectedDog(dog);
  };
  
  const handleCloseModal = () => {
    setSelectedDog(null);
  };

  const handleGeneralInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !whatsappNumber) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    const message = encodeURIComponent(`Olá! Gostei das raças e quero saber mais. Meu nome é ${name} e meu telefone é ${phone}.`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setName('');
    setPhone('');
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <p className="text-brand-primary">Carregando nosso filhotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-100 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-8">Nossos Filhos de 4 Patas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} onInterestClick={handleInterestClick} />
          ))}
        </div>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">Quer saber mais?</h2>
        <p className="text-center text-gray-600 mb-6">
          Preencha seus dados abaixo para mais informações sobre nossas raças.
        </p>
        <form onSubmit={handleGeneralInquirySubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (com DDD)</label>
            <input
              type="tel"
              id="phone"
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
            Quero saber mais via WhatsApp
          </button>
        </form>
      </section>
      
      {selectedDog && <InterestModal dog={selectedDog} onClose={handleCloseModal} whatsappNumber={whatsappNumber} />}
    </div>
  );
};

export default PublicCatalog;