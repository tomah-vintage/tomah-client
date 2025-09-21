export interface MenuCategory {
	id: string;
	name: string;
	menu_item_count: number;
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

export interface DefaultItemCategory {
	id: string;
	name: string;
	mongolian_name?: string;
	image_url?: string;
	is_active: boolean;
	order_index: number;
	created_at: string;
	updated_at: string;
}
