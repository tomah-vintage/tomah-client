import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const restaurants = [
  {
    id: '1',
    name: 'The Golden Spoon',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/sco/b/bf/KFC_logo.svg',
    address: '123 Main St, Anytown, USA',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN',
    openingHours: '10am-11pm'
  },
  {
    id: '2',
    name: 'The Silver Platter',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/sco/b/bf/KFC_logo.svg',
    address: '456 Oak Ave, Anytown, USA',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
    openingHours: '12pm-10pm'
  },
  {
    id: '3',
    name: 'The Silver Platter',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/sco/b/bf/KFC_logo.svg',
    address: '456 Oak Ave, Anytown, USA',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN0',
    openingHours: '11am-9pm,'
  },
  {
    id: '4',
    name: 'The Golden Spoon',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/sco/b/bf/KFC_logo.svg',
    address: '123 Main St, Anytown, USA',
    imageUrl: 'https://www.amrest.eu/sites/default/files/styles/big_hero_image/public/2024-05/kfc0.png?itok=SMeJu6gN',
    openingHours: '9am-10pm,'
  },
];

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('search');
  if (search) {
    const filteredRestaurants = restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    return json(filteredRestaurants);
  }
  return json(restaurants);
};
