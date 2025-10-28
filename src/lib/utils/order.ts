import { apiFetch } from '$lib/utils/api';
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
		const data = await apiFetch('/api/order/create/', {
			method: 'POST',
			body: JSON.stringify(orderData)
		});

		return { success: true, order: data as Order };
	} catch (error: any) {
		console.error('Error creating order:', error);
		return { 
			success: false, 
			error: error.message || error.detail || 'Order creation failed'
		};
	}
};

export const getOrderStatus = async (orderId: number): Promise<OrderStatusResponse> => {
	try {
		const data = await apiFetch(`/api/order/${orderId}/`, {
			method: 'GET'
		});

		return { success: true, order: data as Order };
	} catch (error: any) {
		console.error('Error getting order status:', error);
		return { 
			success: false, 
			error: error.message || error.detail || 'Failed to get order status'
		};
	}
};

export const redirectToPayment = (paymentUrl: string) => {
	if (typeof window !== 'undefined') {
		window.open(paymentUrl, '_blank');
	}
};

export const pollOrderPaymentStatus = async (
	orderId: number,
	onStatusChange: (order: Order) => void,
	intervalMs: number = 3000,
	maxAttempts: number = 60
): Promise<Order | null> => {
	let attempts = 0;
	
	return new Promise((resolve) => {
		const poll = async () => {
			attempts++;
			
			const response = await getOrderStatus(orderId);
			
			if (response.success && response.order) {
				onStatusChange(response.order);
				
				// Check if payment is completed
				if (response.order.payment?.status === 'PAID') {
					resolve(response.order);
					return;
				}
				
				// Check if order status is PREPARING (indicates payment was successful)
				if (response.order.order_status === 'PREPARING') {
					resolve(response.order);
					return;
				}
				
				// Check if payment failed or expired
				if (response.order.payment?.status === 'FAILED' || response.order.payment?.status === 'EXPIRED') {
					resolve(response.order);
					return;
				}
			}
			
			// Continue polling if max attempts not reached
			if (attempts < maxAttempts) {
				setTimeout(poll, intervalMs);
			} else {
				resolve(null); // Timeout
			}
		};
		
		poll();
	});
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