import type { PageServerLoad } from './$types';
import type { SearchResultItem, SearchQuery } from '$lib/types/search';
import { parseSearchUrl } from '$lib/utils/search';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const searchQuery: SearchQuery = parseSearchUrl(url);

	// This server-side load function can optionally pre-fetch initial search results
	// or pass the query to the client-side store for fetching.
	// For simplicity, we'll let the client-side store handle the fetch in this plan.

	return {
		initialQuery: searchQuery // Pass the parsed query to the client
	};
};
