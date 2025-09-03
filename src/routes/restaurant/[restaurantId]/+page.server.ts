import type { PageServerLoad } from './$types';
import type { Restaurant } from '$lib/types/restaurant';
import type { MenuItem, MenuCategory } from '$lib/types/menu';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Fetch restaurant data directly from API
		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/restaurants/${params.restaurantId}`);

		const menuResponse = await fetch(
			`${PUBLIC_BACKEND_URL}/api/menu-item/?restaurant=${params.restaurantId}`
		);
		const categoryResponse = await fetch(
			`${PUBLIC_BACKEND_URL}/api/item-category/?restaurant=${params.restaurantId}`
		);

		if (!response.ok) {
			throw new Error(`Restaurant with ID ${params.restaurantId} not found`);
		}

		const restaurantData = (await response.json()) ?? {};
		const menuData = (await menuResponse.json()) ?? {};
		const categoryData = (await categoryResponse.json()) ?? {};

		// Extract results field from API responses (external API format)
		const restaurant: Restaurant = restaurantData.results || restaurantData;
		const menuItems: MenuItem[] = menuData.results || menuData;
		const categories: MenuCategory[] = categoryData.results || categoryData;

		return {
			restaurant,
			menuItems,
			categories
		};
	} catch (error) {
		throw new Error(
			`Failed to load restaurant: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
};
