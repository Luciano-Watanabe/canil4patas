import React from 'react';
import { Dog } from '../types';

interface DogCardProps {
  dog: Dog;
  onInterestClick: (dog: Dog) => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onInterestClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img src={dog.imageUrl} alt={dog.name} className="w-full h-56 object-cover" />
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-brand-dark">{dog.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{dog.breed} - {dog.age}</p>
        <p className="text-gray-700 flex-grow">{dog.description}</p>
        <button
          onClick={() => onInterestClick(dog)}
          className="mt-4 w-full bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Tenho Interesse!
        </button>
      </div>
    </div>
  );
};

export default DogCard;