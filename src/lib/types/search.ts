export interface SearchQuery {
	query: string;
	filters?: Record<string, string>;
	sortBy?: string;
}

export interface SearchResultItem {
	id: string;
	type: 'restaurant' | 'menuItem';
	name: string;
	description?: string;
	imageUrl?: string;
	rating?: number;
	address?: string;
	hours?: string;
	location?: {
		lat: number;
		lng: number;
	};
	// For menu items
	restaurantId?: string;
	restaurantName?: string;
	price?: number;
}

export interface SearchState {
	results: SearchResultItem[];
	loading: boolean;
	error: string | null;
	currentQuery: SearchQuery;
}