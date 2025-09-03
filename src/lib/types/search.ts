export interface SearchQuery {
	query: string;
	filters?: Record<string, string>;
	sortBy?: string;
}

export interface SearchResultItem {
	id: string;
	type: 'restaurant' | 'menuItem'; // Or other types as needed
	name: string;
	description?: string;
	imageUrl?: string;
	// Add other relevant properties based on type
}

export interface SearchState {
	results: SearchResultItem[];
	loading: boolean;
	error: string | null;
	currentQuery: SearchQuery;
}
