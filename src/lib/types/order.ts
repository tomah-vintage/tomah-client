export interface User {
	id: number;
	email: string;
	username: string;
}

export interface Restaurant {
	id: number;
	name: string;
}

export interface Table {
	id: number;
	number: string;
}

export interface Box {
	id: number;
	name: string;
}

export interface MenuItem {
	id: number;
	name: string;
	price: string;
}

export interface OrderItem {
	order?: number;
	menu_item: number;
	quantity: number;
	unit_price: string;
}

export interface PaymentMethod {
	id: number;
	name: string;
	user: number;
}

export interface OrderPayment {
	order: number;
	amount: string;
	status: 'PENDING' | 'COMPLETED' | 'FAILED';
	payment_method: PaymentMethod | null;
	paid_at: string | null;
}

export interface Order {
	id: number;
	user: number;
	restaurant: number;
	order_status: 'PENDING' | 'PREPARING' | 'READY' | 'CANCELLED' | 'IN_BOX' | 'DONE';
	total_price: string;
	table: Table | null;
	box: Box | null;
	order_type: 'DINE_IN' | 'TAKE_OUT';
	created_at?: string;
	updated_at?: string;
	items: OrderItem[];
}

export interface OrdersResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Order[];
}