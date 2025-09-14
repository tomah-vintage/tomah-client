import { apiFetch } from '$lib/utils/api';
import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';
import type { Banner } from '$lib/types/banner';
import type { Restaurant } from '$lib/types/restaurant';


interface RestaurantsResponse {
	results?: Restaurant[];
}

export const load: PageLoad = async ({  }) => {

	const fetchRestaurants = async () => {
		try {
            const url = `${env.PUBLIC_BACKEND_URL}/api/restaurants/`;
			const restaurantData = await apiFetch<RestaurantsResponse>(url);
			
			return restaurantData.results || [];
		} catch (error) {
			console.error('Failed to fetch restaurants:', error);
			return []; // Return empty array on error
		}
	};

	return {
		restaurants: fetchRestaurants()
	};
};
