import { apiFetch, getAuthToken } from '$lib/utils/api';
import { env } from '$env/dynamic/public';

export interface OrderItem {
	menu_item: string;
	quantity: number;
	unit_price: string;
}

export interface CreateOrderRequest {
	restaurant: number;
	table?: number;
	order_type: 'DINE_IN' | 'TAKE_OUT';
	items: OrderItem[];
}

export interface PaymentInfo {
	invoice_id: string;
	payment_url: string;
	expires_at: string;
	status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
}

export interface Order {
	id: number;
	user: number;
	restaurant: number;
	order_status: 'PENDING' | 'PREPARING' | 'IN_BOX' | 'DONE' | 'CANCELLED';
	total_price: string;
	table?: number;
	order_type: 'DINE_IN' | 'TAKE_OUT';
	created_at: string;
	items: OrderItem[];
	payment?: PaymentInfo;
}

export interface OrderResponse {
	success: boolean;
	order?: Order;
	error?: string;
}

export interface OrderStatusResponse {
	success: boolean;
	order?: Order;
	error?: string;
}

export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
	try {
		const token = getAuthToken();
		if (!token) {
			return { success: false, error: 'Authentication required' };
		}

		const response = await fetch('/api/order/create/', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(orderData)
		});

		const data = await response.json();

		if (!response.ok) {
			return { 
				success: false, 
				error: data.error || `Order creation failed: ${response.status}` 
			};
		}

		return { success: true, order: data };
	} catch (error) {
		console.error('Network error creating order:', error);
		return { success: false, error: 'Network error occurred' };
	}
};

export const getOrderStatus = async (orderId: number): Promise<OrderStatusResponse> => {
	try {
		const token = getAuthToken();
		if (!token) {
			return { success: false, error: 'Authentication required' };
		}

		const response = await fetch(`/api/order/${orderId}/`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();

		if (!response.ok) {
			return { 
				success: false, 
				error: data.error || `Failed to get order status: ${response.status}` 
			};
		}

		return { success: true, order: data };
	} catch (error) {
		console.error('Network error getting order status:', error);
		return { success: false, error: 'Network error occurred' };
	}
};

export const redirectToPayment = (paymentUrl: string) => {
	if (typeof window !== 'undefined') {
		window.open(paymentUrl, '_blank');
	}
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
	'PENDING': 'Төлбөр хүлээгдэж байна',
	'PREPARING': 'Хоол бэлтгэж байна',
	'IN_BOX': 'Авахад бэлэн',
	'DONE': 'Дууссан',
	'CANCELLED': 'Цуцлагдсан'
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
	'PENDING': 'Төлбөр хүлээгдэж байна',
	'PAID': 'Төлбөр төлөгдсөн',
	'FAILED': 'Төлбөр амжилтгүй',
	'EXPIRED': 'Төлбөрийн хугацаа дууссан'
};