import { createQuery } from '$lib/utils/query';
import { apiFetch } from '$lib/utils/api';
import { env } from '$env/dynamic/public';
import type { Restaurant } from '$lib/types/restaurant';

interface RestaurantsResponse {
	results?: Restaurant[];
	count?: number;
	next?: string | null;
	previous?: string | null;
}

export function createRestaurantsQuery() {
	return createQuery<RestaurantsResponse>({
		queryKey: ['restaurants'],
		queryFn: () => apiFetch<RestaurantsResponse>(`${env.PUBLIC_BACKEND_URL}/api/restaurants/`)
	});
}

export function createRestaurantQuery(restaurantId: number) {
	return createQuery<Restaurant>({
		queryKey: ['restaurant', restaurantId],
		queryFn: () => apiFetch<Restaurant>(`${env.PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/`)
	});
}