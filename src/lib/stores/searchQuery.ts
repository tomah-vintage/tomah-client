import { createQuery } from '$lib/utils/query';
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { SearchResultItem, SearchQuery } from '$lib/types/search';

interface SearchResponse {
	results: SearchResultItem[];
	count?: number;
	next?: string | null;
	previous?: string | null;
}

export function createSearchQuery(searchParams: SearchQuery) {
	const params = new URLSearchParams();
	params.append('name', searchParams.query);
	
	if (searchParams.filters) {
		Object.entries(searchParams.filters).forEach(([key, value]) => {
			params.append(key, value);
		});
	}
	
	if (searchParams.sortBy) {
		params.append('sortBy', searchParams.sortBy);
	}
	
	if (searchParams.latitude) {
		params.append('latitude', searchParams.latitude.toString());
	}
	
	if (searchParams.longitude) {
		params.append('longitude', searchParams.longitude.toString());
	}
	
	if (searchParams.radius) {
		params.append('radius', searchParams.radius.toString());
	}

	return createQuery<SearchResponse>({
		queryKey: ['search', searchParams],
		queryFn: () => apiFetch<SearchResponse>(`${PUBLIC_BACKEND_URL}/api/restaurants/search?${params.toString()}`),
		enabled: () => !!searchParams.query.trim() || (searchParams.latitude && searchParams.longitude)
	});
}