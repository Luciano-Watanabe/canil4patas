import { Dog } from './types';

export const ADMIN_PASSWORD = '12991564197';
// This will be the default number if none is configured in the admin panel
export const WHATSAPP_NUMBER = '5512981371613';

export const INITIAL_DOG_DATA: Dog[] = [
  {
    id: 1,
    name: 'Max',
    breed: 'Golden Retriever',
    age: '2 anos',
    description: 'Um companheiro leal e brincalhão, ótimo com crianças e outros animais. Adora buscar bolinhas.',
    imageUrl: 'https://picsum.photos/seed/max/400/400',
  },
  {
    id: 2,
    name: 'Bella',
    breed: 'Beagle',
    age: '1 ano e 6 meses',
    description: 'Curiosa e cheia de energia, Bella é uma exploradora nata que vai encher sua casa de alegria.',
    imageUrl: 'https://picsum.photos/seed/bella/400/400',
  },
  {
    id: 3,
    name: 'Rocky',
    breed: 'Vira-lata Caramelo',
    age: '3 anos',
    description: 'Um cãozinho inteligente e muito carinhoso. Rocky é a prova de que o amor não tem raça.',
    imageUrl: 'https://picsum.photos/seed/rocky/400/400',
  },
  {
    id: 4,
    name: 'Luna',
    breed: 'Shih Tzu',
    age: '4 anos',
    description: 'Calma e afetuosa, Luna é a companhia perfeita para quem busca um amigo tranquilo para o sofá.',
    imageUrl: 'https://picsum.photos/seed/luna/400/400',
  },
    {
    id: 5,
    name: 'Toby',
    breed: 'Poodle',
    age: '8 meses',
    description: 'Um filhote esperto e que aprende rápido. Toby está pronto para aprender truques e se divertir.',
    imageUrl: 'https://picsum.photos/seed/toby/400/400',
  },
  {
    id: 6,
    name: 'Kira',
    breed: 'Pastor Alemão',
    age: '2 anos',
    description: 'Protetora e muito inteligente, Kira é uma cadela incrível para quem tem espaço e amor para dar.',
    imageUrl: 'https://picsum.photos/seed/kira/400/400',
  },
];