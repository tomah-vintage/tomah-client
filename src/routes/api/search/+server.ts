import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SearchResultItem } from '$lib/types/search';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const typeFilter = url.searchParams.get('type');
	const sortBy = url.searchParams.get('sortBy') || 'relevance';
	const category = url.searchParams.get('category');
	const latitude = url.searchParams.get('latitude');
	const longitude = url.searchParams.get('longitude');
	const radius = url.searchParams.get('radius');

	try {
		const backendUrl = new URL(`${PUBLIC_BACKEND_URL}/api/restaurants/search/`);
		backendUrl.searchParams.append('name', query);
		if (typeFilter) backendUrl.searchParams.append('type', typeFilter);
		if (sortBy) backendUrl.searchParams.append('sortBy', sortBy);
		if (category) backendUrl.searchParams.append('category', category);
		if (latitude) backendUrl.searchParams.append('latitude', latitude);
		if (longitude) backendUrl.searchParams.append('longitude', longitude);
		if (radius) backendUrl.searchParams.append('radius', radius);

		const response = await fetch(backendUrl.toString());

		if (!response.ok) {
			throw new Error(`Backend API error: ${response.statusText}`);
		}

		const data = await response.json();

		const results: SearchResultItem[] = data.results.map((item: any) => ({
			id: item.id.toString(),
			type: 'restaurant',
			name: item.name,
			description: item.description,
			imageUrl: item.logo || (item.restaurant_img_urls && item.restaurant_img_urls[0]),
			rating: item.average_rating,
			address: item.address,
			hours:
				item.open_hours && item.open_hours.length > 0
					? `${item.open_hours[0].open_time} - ${item.open_hours[0].close_time}`
					: 'N/A',
			location:
				item.latitude && item.longitude ? { lat: item.latitude, lng: item.longitude } : undefined
		}));

		return json({ results });
	} catch (error: any) {
		return json({ error: `Failed to fetch search results: ${error.message}` }, { status: 500 });
	}
};
