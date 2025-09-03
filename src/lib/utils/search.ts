import type { SearchQuery, SearchResultItem } from '$lib/types/search';

export const buildSearchUrl = (query: SearchQuery): string => {
	const params = new URLSearchParams();
	params.append('q', query.query);
	if (query.filters) {
		Object.entries(query.filters).forEach(([key, value]) => {
			params.append(key, value);
		});
	}
	if (query.sortBy) {
		params.append('sortBy', query.sortBy);
	}
	return `/search?${params.toString()}`;
};

export const parseSearchUrl = (url: URL): SearchQuery => {
	const query = url.searchParams.get('q') || '';
	const filters: Record<string, string> = {};
	for (const [key, value] of url.searchParams.entries()) {
		if (key !== 'q' && key !== 'sortBy') {
			filters[key] = value;
		}
	}
	const sortBy = url.searchParams.get('sortBy') || undefined;
	return { query, filters, sortBy };
};

export const apiEndpoints = {
	search: '/api/search'
};
