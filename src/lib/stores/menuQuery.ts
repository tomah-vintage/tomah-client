import { createQuery } from '$lib/utils/query';
import { apiFetch } from '$lib/utils/api';
import { env } from '$env/dynamic/public';
import type { MenuItem, MenuCategory } from '$lib/types/menu';

// Raw API response with string prices
interface RawMenuItem extends Omit<MenuItem, 'price' | 'container_price'> {
	price: string | number;
	container_price: string | number;
}

interface MenuItemsResponse {
	results?: RawMenuItem[];
	count?: number;
	next?: string | null;
	previous?: string | null;
}

interface CategoriesResponse {
	results?: MenuCategory[];
	count?: number;
	next?: string | null;
	previous?: string | null;
}

export function createMenuItemsQuery(restaurantId: number) {
	return createQuery<MenuItemsResponse>({
		queryKey: ['menuItems', restaurantId],
		queryFn: async () => {
			const response = await apiFetch<MenuItemsResponse>(
				`${env.PUBLIC_BACKEND_URL}/api/menu-item/?restaurant=${restaurantId}`
			);
			// Convert string prices to numbers
			if (response.results) {
				response.results = response.results.map((item) => ({
					...item,
					price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
					container_price:
						typeof item.container_price === 'string'
							? parseFloat(item.container_price)
							: item.container_price
				}));
			}
			return response;
		}
	});
}

export function createCategoriesQuery(restaurantId: number) {
	return createQuery<CategoriesResponse>({
		queryKey: ['categories', restaurantId],
		queryFn: () =>
			apiFetch<CategoriesResponse>(
				`${env.PUBLIC_BACKEND_URL}/api/item-category/?restaurant=${restaurantId}`
			)
	});
}
