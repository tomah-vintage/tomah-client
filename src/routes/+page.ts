import { apiFetch } from '$lib/utils/api';
import { env } from '$env/dynamic/public';
import type { PageLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';
import { restaurantActions } from '$lib/stores/restaurant';

interface RestaurantsResponse {
	results?: Restaurant[];
}

interface RestaurantHighlight {
	id: number;
	name: string;
	display_name: string;
	highlight_type: string;
	highlight_type_display: string;
	color: string;
	icon: string | null;
	is_active: boolean;
	order_index: number;
	restaurants: Restaurant[];
	created_at: string;
	updated_at: string;
}

export const load: PageLoad = async ({  }) => {

	const fetchRestaurantHighlights = async () => {
		try {
			const url = `${env.PUBLIC_BACKEND_URL}/api/public-restaurant-highlights/`;
			const highlightsData = await apiFetch<RestaurantHighlight[]>(url);
			
			return highlightsData || [];
		} catch (error) {
			console.error('Failed to fetch restaurant highlights:', error);
			return []; // Return empty array on error
		}
	};

	return {
		highlights: fetchRestaurantHighlights()
	};
};
