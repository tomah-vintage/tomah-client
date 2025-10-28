import { createQuery } from '$lib/utils/query';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { DefaultItemCategory } from '$lib/types/menu';

export function createCategoriesQuery() {
	return createQuery<DefaultItemCategory[]>({
		queryKey: ['default-categories'],
		queryFn: async () => {
			try {
				const response = await apiFetch<DefaultItemCategory[]>(`${PUBLIC_BACKEND_URL}/api/default-categories/`);
				return response;
			} catch (error) {
				console.error('Failed to fetch categories:', error);
				// Return empty array to fall back to default categories
				return [];
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
		retryDelay: 1000, // 1 second
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}