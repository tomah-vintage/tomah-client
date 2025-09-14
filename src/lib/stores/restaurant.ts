import { writable } from 'svelte/store';
import type { Restaurant } from '$lib/types/restaurant';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { apiFetch } from '$lib/utils/api';

 interface RestaurantsResponse {
	results?: Restaurant[];
	count?: number;
	next?: string | null;
	previous?: string | null;
}

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
			const data = await apiFetch<RestaurantsResponse>(`${PUBLIC_BACKEND_URL}/api/restaurants/`)

			const restaurants = data?.results || [];
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
