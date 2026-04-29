import { error } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { PageLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';

export const load: PageLoad = async ({ params, fetch, url }) => {
	const restaurantId = parseInt(params.restaurantId || '0', 10);
	const tableId = url.searchParams.get('table');
	
	if (!restaurantId || isNaN(restaurantId)) {
		throw error(404, 'Restaurant not found');
	}

	try {
		// Fetch restaurant data server-side for better SEO
		const restaurantResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/`);
		
		if (!restaurantResponse.ok) {
			if (restaurantResponse.status === 404) {
				throw error(404, 'Restaurant not found');
			}
			throw error(500, 'Failed to load restaurant data');
		}

		const restaurant: Restaurant = await restaurantResponse.json();

		// Fetch all menu items for initial load
		let menuItems: unknown[] = [];
		let menuUrl: string | null =
			`${PUBLIC_BACKEND_URL}/api/restaurants/${restaurantId}/menu-items/?page_size=1000`;

		while (menuUrl) {
			const menuResponse = await fetch(menuUrl);
			if (!menuResponse.ok) break;
			const menuData = await menuResponse.json();
			menuItems = menuItems.concat(menuData.results || []);
			menuUrl = menuData.next ?? null;
		}

		return {
			restaurant,
			menuItems,
			restaurantId,
			tableId
		};
	} catch (err) {
		if (err instanceof Error && 'status' in err) {
			throw err; // Re-throw SvelteKit errors
		}
		throw error(500, 'Failed to load restaurant data');
	}
};