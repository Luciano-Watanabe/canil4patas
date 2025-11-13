import React, { useState, useEffect } from 'react';
import { Dog } from '../types';
import { getDogs, addDog, updateDog, deleteDog } from '../services/firebaseService';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon';

const emptyDog: Omit<Dog, 'id'> = {
  name: '',
  breed: '',
  age: '',
  description: '',
  imageUrl: '',
};

const CatalogManager: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [formData, setFormData] = useState<Omit<Dog, 'id'>>(emptyDog);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDogs = async () => {
    setLoading(true);
    const dogsFromDb = await getDogs();
    setDogs(dogsFromDb);
    setLoading(false);
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  useEffect(() => {
    if (isEditing !== null) {
      const dogToEdit = dogs.find(d => d.id === isEditing);
      if (dogToEdit) {
        const { id, ...editableData } = dogToEdit;
        setFormData(editableData);
      }
    } else {
      setFormData(emptyDog);
    }
  }, [isEditing, dogs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing !== null) {
      await updateDog(isEditing, formData);
    } else {
      await addDog(formData);
    }
    await fetchDogs();
    setIsEditing(null);
    setFormData(emptyDog);
  };

  const handleEdit = (id: string) => {
    setIsEditing(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData(emptyDog);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cão do catálogo?')) {
      await deleteDog(id);
      await fetchDogs();
      if (isEditing === id) {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h3 className="text-xl font-bold text-brand-dark mb-4">{isEditing ? 'Editar Cão' : 'Adicionar Novo Cão'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
          
          <div>
            <label htmlFor="dog-name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type='text'
              id='dog-name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder='Ex: Max'
            />
          </div>

          <div>
            <label htmlFor="dog-breed" className="block text-sm font-medium text-gray-700">Raça</label>
            <input
              type='text'
              id='dog-breed'
              name='breed'
              value={formData.breed}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder='Ex: Golden Retriever'
            />
          </div>

          <div>
            <label htmlFor="dog-age" className="block text-sm font-medium text-gray-700">Idade</label>
            <input
              type='text'
              id='dog-age'
              name='age'
              value={formData.age}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder='Ex: 2 anos'
            />
          </div>
          
          <div>
            <label htmlFor="dog-imageUrl" className="block text-sm font-medium text-gray-700">URL da Imagem</label>
            <input
              type='url'
              id='dog-imageUrl'
              name='imageUrl'
              value={formData.imageUrl}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder='https://exemplo.com/imagem.jpg'
            />
          </div>

          <div>
            <label htmlFor="dog-description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              id="dog-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="Descreva o cãozinho"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              {isEditing ? 'Salvar Alterações' : 'Adicionar Cão'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold text-brand-dark mb-4">Catálogo Atual ({dogs.length})</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-[42rem] overflow-y-auto">
          {loading ? (
             <p className="text-center text-gray-500 py-8">Carregando catálogo...</p>
          ) : dogs.length > 0 ? (
            <ul className="space-y-3">
              {dogs.map(dog => (
                <li key={dog.id} className="bg-white p-4 rounded-md shadow-sm flex items-center gap-4">
                  <img src={dog.imageUrl} alt={dog.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0 bg-gray-200" />
                  <div className="flex-grow">
                    <p className="font-bold text-lg text-brand-dark">{dog.name}</p>
                    <p className="text-sm text-gray-600">{dog.breed} - {dog.age}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dog.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button title="Editar" onClick={() => handleEdit(dog.id)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button title="Excluir" onClick={() => handleDelete(dog.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum cão cadastrado no catálogo.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default CatalogManager;