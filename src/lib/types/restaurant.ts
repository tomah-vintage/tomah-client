export interface OpenHours {
	day_of_week: number;
	opening_time: string;
	closing_time: string;
	day_of_week_display: string;
}

export interface Restaurant {
	id: string;
	name: string;
	logo: string;
	address: string;
	restaurant_img_urls: string[];
	openingHours?: string; // Keep for backwards compatibility
	open_hours?: OpenHours[];
	latitude?: string;
	longitude?: string;
	lat?: number;
	lng?: number;
	featuredItems?: any[];
	menu?: {
		categories: any[];
		items: any[];
	};
	reviews?: any[];
	discount?: number;
	rating?: number;
	average_rating?: number;
}
