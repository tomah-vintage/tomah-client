import type { PageServerLoad } from './$types';
import type { MenuItem } from '$lib/types/menu';

export const load: PageServerLoad = async ({ params }) => {
  // In a real application, you would fetch the menu from a database
  // or an API using the restaurantId. For now, we'll use mock data.
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Pizza',
      description: 'A delicious pizza with your choice of toppings.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '2',
      name: 'Burger',
      description: 'A juicy burger with all the fixings.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '3',
      name: 'Salad',
      description: 'A healthy salad with fresh vegetables.',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return {
    restaurantId: params.restaurantId,
    menuItems,
  };
};
