import type { PageServerLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const searchTerm = url.searchParams.get('search') || '';
  try {
    const response = await fetch(`/api/restaurants?search=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Failed to load restaurants');
    }
    const { restaurants }: { restaurants: Restaurant[] } = await response.json();
    return {
      restaurants,
      searchTerm
    };
  } catch (error) {
    console.error('Error loading restaurants:', error);
    return {
      restaurants: [],
      error: 'Failed to load restaurants',
      searchTerm
    };
  }
};
