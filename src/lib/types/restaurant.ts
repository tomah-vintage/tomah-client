export interface Restaurant {
	id: string;
	name: string;
	logo: string;
	address: string;
	restaurant_img_urls: string[];
	openingHours: string;
	lat?: number;
	lng?: number;
	featuredItems?: any[];
	menu?: {
		categories: any[];
		items: any[];
	};
	reviews?: any[];
}
