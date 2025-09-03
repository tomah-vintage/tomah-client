import { writable } from 'svelte/store';
import type { SearchState, SearchQuery, SearchResultItem } from '$lib/types/search';
import { apiEndpoints } from '$lib/utils/search';

export const searchStore = writable<SearchState>({
	results: [],
	loading: false,
	error: null,
	currentQuery: { query: '' }
});

export const searchActions = {
	async performSearch(query: SearchQuery) {
		searchStore.update((state) => ({ ...state, loading: true, error: null, currentQuery: query }));
		try {
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
			const response = await fetch(`${apiEndpoints.search}?${params.toString()}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			searchStore.update((state) => ({ ...state, results: data.results, loading: false }));
		} catch (error: any) {
			searchStore.update((state) => ({ ...state, error: error.message, loading: false }));
		}
	}
};
