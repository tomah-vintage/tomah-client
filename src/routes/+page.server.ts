import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/api/restaurant');
    if (!response.ok) {
      throw new Error('Failed to load restaurants');
    }
    const restaurants = await response.json();
    return {
      restaurants
    };
  } catch (error) {
    console.error('Error loading restaurants:', error);
    return {
      restaurants: [],
      error: 'Failed to load restaurants'
    };
  }
};
