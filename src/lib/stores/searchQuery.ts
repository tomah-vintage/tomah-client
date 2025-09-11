import { createQuery } from '$lib/utils/query';
import { apiFetch } from '$lib/utils/api';
import { env } from '$env/dynamic/public';
import type { SearchResultItem, SearchQuery } from '$lib/types/search';

interface SearchResponse {
	results: SearchResultItem[];
	count?: number;
	next?: string | null;
	previous?: string | null;
}

export function createSearchQuery(searchParams: SearchQuery) {
	const params = new URLSearchParams();
	params.append('q', searchParams.query);
	
	if (searchParams.filters) {
		Object.entries(searchParams.filters).forEach(([key, value]) => {
			params.append(key, value);
		});
	}
	
	if (searchParams.sortBy) {
		params.append('sortBy', searchParams.sortBy);
	}

	return createQuery<SearchResponse>({
		queryKey: ['search', searchParams],
		queryFn: () => apiFetch<SearchResponse>(`${env.PUBLIC_BACKEND_URL}/api/restaurants/search?${params.toString()}`),
		enabled: !!searchParams.query.trim()
	});
}