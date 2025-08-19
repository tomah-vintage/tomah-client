import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const restaurants = [
  {
    id: '1',
    name: 'The Golden Spoon',
    logoUrl: 'https://via.placeholder.com/150',
    address: '123 Main St, Anytown, USA',
    imageUrl: 'https://via.placeholder.com/400x200',
    openingHours: 'Mon-Fri: 9am-10pm, Sat-Sun: 10am-11pm'
  },
  {
    id: '2',
    name: 'The Silver Platter',
    logoUrl: 'https://via.placeholder.com/150',
    address: '456 Oak Ave, Anytown, USA',
    imageUrl: 'https://via.placeholder.com/400x200',
    openingHours: 'Mon-Fri: 11am-9pm, Sat-Sun: 12pm-10pm'
  }
];

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('search');
  if (search) {
    const filteredRestaurants = restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    return json(filteredRestaurants);
  }
  return json(restaurants);
};
