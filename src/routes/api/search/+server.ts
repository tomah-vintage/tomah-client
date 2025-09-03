import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SearchResultItem } from '$lib/types/search';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const typeFilter = url.searchParams.get('type'); // Example filter
	const sortBy = url.searchParams.get('sortBy') || 'relevance';

	try {
		// Fetch restaurant information from the backend
		const backendUrl = `${PUBLIC_BACKEND_URL}/api/restaurants?q=${encodeURIComponent(query)}&type=${encodeURIComponent(typeFilter || '')}&sortBy=${encodeURIComponent(sortBy)}`;
		const response = await fetch(backendUrl);

		if (!response.ok) {
			throw new Error(`Backend API error: ${response.statusText}`);
		}

		const data = await response.json();
		// Assuming the backend returns an array of restaurant objects that can be mapped to SearchResultItem
		const results: SearchResultItem[] = data.results.map((restaurant: any) => ({
			id: restaurant.id,
			type: 'restaurant',
			name: restaurant.name,
			description: restaurant.description || '',
			imageUrl: restaurant.imageUrl || '' // Assuming imageUrl exists
		}));

		// Further filter and sort if needed on the frontend, or rely on backend
		const filteredResults = results.filter((item) => {
			const matchesQuery =
				item.name.toLowerCase().includes(query.toLowerCase()) ||
				(item.description && item.description.toLowerCase().includes(query.toLowerCase()));
			const matchesType = typeFilter ? item.type === typeFilter : true;
			return matchesQuery && matchesType;
		});

		// Simple sorting logic (can be expanded)
		filteredResults.sort((a, b) => {
			if (sortBy === 'name') {
				return a.name.localeCompare(b.name);
			} else if (sortBy === 'type') {
				return a.type.localeCompare(b.type);
			}
			return 0; // Relevance or other complex sorting
		});

		return json({ results: filteredResults });
	} catch (error: any) {
		console.error('Error fetching search results:', error);
		return json({ error: `Failed to fetch search results: ${error.message}` }, { status: 500 });
	}
};
