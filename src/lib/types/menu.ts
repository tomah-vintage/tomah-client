export interface MenuCategory {
	id: string;
	name: string;
	menu_item_count: number
}

export interface MenuItem {
	id: string;
	name: string;
	description: string;
	price: number;
	img_urls: string;
	meta_data: any;
	categories: string[];
}
