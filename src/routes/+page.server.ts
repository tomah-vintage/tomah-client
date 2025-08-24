import type { PageServerLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';
import { restaurantActions, restaurantStore } from '$lib/stores/restaurant';
import { get } from 'svelte/store';

export const load: PageServerLoad = async ({  url }) => {
	const searchTerm = url.searchParams.get('search') || '';
	try {
		await restaurantActions.loadRestaurants();
		const { restaurants }: { restaurants: Restaurant[] } =  get(restaurantStore);


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
