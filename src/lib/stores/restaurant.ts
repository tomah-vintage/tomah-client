import { writable } from 'svelte/store';
import type { Restaurant } from '$lib/types/restaurant';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export interface RestaurantState {
	restaurants: Restaurant[];
	loading: boolean;
	error: string | undefined;
}

export const restaurantStore = writable<RestaurantState>({
	restaurants: [],
	loading: true,
	error: undefined
});

export const restaurantActions = {
	async loadRestaurants() {
		restaurantStore.update((state) => ({ ...state, loading: true }));
		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/api/restaurants/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Failed to load restaurants');
			}
			const data = await response.json();

			const restaurants = data.results || data;
			restaurantStore.update((state) => ({ ...state, restaurants, loading: false }));
		} catch (error) {
			if (error instanceof Error) {
				restaurantStore.update((state) => ({ ...state, error: error.message, loading: false }));
			} else {
				restaurantStore.update((state) => ({
					...state,
					error: 'An unknown error occurred',
					loading: false
				}));
			}
		}
	}
};
