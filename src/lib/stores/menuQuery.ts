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

function convertPrices(item: RawMenuItem): RawMenuItem {
	return {
		...item,
		price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
		container_price:
			typeof item.container_price === 'string'
				? parseFloat(item.container_price)
				: item.container_price
	};
}

export function createMenuItemsQuery(restaurantId: number) {
	return createQuery<MenuItemsResponse>({
		queryKey: ['menuItems', restaurantId],
		queryFn: async () => {
			let allItems: RawMenuItem[] = [];
			let nextUrl: string | null =
				`${env.PUBLIC_BACKEND_URL}/api/menu-item/?restaurant=${restaurantId}&page_size=1000`;

			while (nextUrl) {
				const response = await apiFetch<MenuItemsResponse>(nextUrl);
				if (response.results) {
					allItems = allItems.concat(response.results.map(convertPrices));
				}
				nextUrl = response.next ?? null;
			}

			return { results: allItems, count: allItems.length, next: null, previous: null };
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
