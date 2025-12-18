export interface CartItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
	container_price: number;
	img_urls: string;
	restaurant_id: number;
	order_type?: 'DINE_IN' | 'TAKE_OUT';
	is_takeout?: boolean; // Per-item takeout flag for container fees
}
