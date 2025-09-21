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
				throw error;
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 1,
	});
}