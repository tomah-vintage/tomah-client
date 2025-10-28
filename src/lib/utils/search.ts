import type { SearchQuery, SearchResultItem } from '$lib/types/search';

export const constructSearchUrl = (query: SearchQuery, basePath: string): string => {
	const params = new URLSearchParams();
	params.append('q', query.query);
	if (query.filters) {
		Object.entries(query.filters).forEach(([key, value]) => {
			if (value) {
				params.append(key, value);
			}
		});
	}
	if (query.sortBy) {
		params.append('sortBy', query.sortBy);
	}
	if (query.latitude) {
		params.append('latitude', query.latitude.toString());
	}
	if (query.longitude) {
		params.append('longitude', query.longitude.toString());
	}
	if (query.radius) {
		params.append('radius', query.radius.toString());
	}
	return `${basePath}?${params.toString()}`;
};

export const parseSearchUrl = (url: URL): SearchQuery => {
	const query = url.searchParams.get('q') || '';
	const filters: Record<string, string> = {};
	const locationKeys = ['latitude', 'longitude', 'radius'];
	
	for (const [key, value] of url.searchParams.entries()) {
		if (key !== 'q' && key !== 'sortBy' && !locationKeys.includes(key)) {
			filters[key] = value;
		}
	}
	
	const sortBy = url.searchParams.get('sortBy') || undefined;
	const latitude = url.searchParams.get('latitude') ? parseFloat(url.searchParams.get('latitude')!) : undefined;
	const longitude = url.searchParams.get('longitude') ? parseFloat(url.searchParams.get('longitude')!) : undefined;
	const radius = url.searchParams.get('radius') ? parseFloat(url.searchParams.get('radius')!) : undefined;
	
	return { query, filters, sortBy, latitude, longitude, radius };
};

export const apiEndpoints = {
	search: '/api/search'
};
