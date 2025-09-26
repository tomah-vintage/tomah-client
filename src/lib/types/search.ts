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
	average_rating?: number;
	address?: string;
	hours?: string;
	open_hours?: Array<{
		day_of_week: number;
		opening_time: string;
		closing_time: string;
		day_of_week_display: string;
	}>;
	restaurant_img_urls: string[];
	latitude: string;
	longitude:string;
	restaurantId?: string;
	restaurantName?: string;
	price?: number;
	isLiked?: boolean 
}

export interface SearchState {
	results: SearchResultItem[];
	loading: boolean;
	error: string | null;
	currentQuery: SearchQuery;
}