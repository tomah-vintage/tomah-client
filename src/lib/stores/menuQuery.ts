import { createQuery } from '$lib/utils/query';
import { apiFetch } from '$lib/utils/api';
import { env } from '$env/dynamic/public';
import type { MenuItem, MenuCategory } from '$lib/types/menu';

interface MenuItemsResponse {
	results?: MenuItem[];
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
		queryFn: () => apiFetch<MenuItemsResponse>(`${env.PUBLIC_BACKEND_URL}/api/menu-item/?restaurant=${restaurantId}`)
	});
}

export function createCategoriesQuery(restaurantId: number) {
	return createQuery<CategoriesResponse>({
		queryKey: ['categories', restaurantId],
		queryFn: () => apiFetch<CategoriesResponse>(`${env.PUBLIC_BACKEND_URL}/api/item-category/?restaurant=${restaurantId}`)
	});
}