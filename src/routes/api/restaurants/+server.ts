import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Restaurant } from '$lib/types/restaurant';

// Mock data for restaurants
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Golden Spoon',
    logoUrl: '/logo.png',
    address: '123 Main St, Anytown',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
    openingHours: '9 AM - 10 PM'
  },
  {
    id: '2',
    name: 'Pizza Palace',
    logoUrl: '/logo.png',
    address: '456 Oak Ave, Anytown',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
    openingHours: '11 AM - 11 PM'
  },
  {
    id: '3',
    name: 'Sushi Central',
    logoUrl: '/logo.png',
    address: '789 Pine Ln, Anytown',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
    openingHours: '12 PM - 9 PM'
  },
  {
    id: '4',
    name: 'Burger Barn',
    logoUrl: '/logo.png',
    address: '101 Elm St, Anytown',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
    openingHours: '10 AM - 10 PM'
  },
  {
    id: '5',
    name: 'Taco Tuesday',
    logoUrl: '/logo.png',
    address: '202 Maple Dr, Anytown',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
    openingHours: '8 AM - 9 PM'
  }
];

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('search') || '';
  let restaurants = mockRestaurants;

  if (search) {
    restaurants = mockRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return json({ restaurants });
};
