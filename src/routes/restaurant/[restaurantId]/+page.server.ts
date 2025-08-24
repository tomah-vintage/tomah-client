import type { PageServerLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';
import type { MenuItem, MenuCategory } from '$lib/types/menu';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Fetch restaurant data directly from API
		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/restaurants/${params.restaurantId}`);

		const menuResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/menu-item/?restaurant=${params.restaurantId}`);
		const categoryResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/item-category/?restaurant=${params.restaurantId}`);
		
		if (!response.ok) {
			throw new Error(`Restaurant with ID ${params.restaurantId} not found`);
		}
		
		const restaurant: Restaurant = await response.json();
		const menuItems: MenuItem[] = await menuResponse.json();
		const categories: MenuCategory[] = await categoryResponse.json();
		
		return {
			restaurant,
			menuItems,
			categories
		};
	} catch (error) {
		throw new Error(`Failed to load restaurant: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};
