import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// Get authorization header from request
		const authHeader = request.headers.get('authorization');

		// Get token from cookies as fallback
		const token = cookies.get('token');
		const finalAuthHeader = authHeader || (token ? `Bearer ${token}` : '');

		if (!finalAuthHeader) {
			return json({ error: 'Authentication token required' }, { status: 401 });
		}

		const orderData = await request.json();

		// Validate required fields
		if (!orderData.restaurant || !orderData.items || orderData.items.length === 0) {
			return json({ error: 'Invalid order data' }, { status: 400 });
		}

		// Calculate total price from items
		const totalPrice = orderData.items.reduce((sum: number, item: any) => {
			return sum + (parseFloat(item.unit_price) * item.quantity);
		}, 0);

		// Extract user ID from JWT token
		const tokenParts = finalAuthHeader.replace('Bearer ', '').split('.');
		let userId = null;
		try {
			const payload = JSON.parse(atob(tokenParts[1]));
			userId = payload.user_id;
		} catch (e) {
			return json({ error: 'Invalid token' }, { status: 401 });
		}

		// Add required fields that backend expects
		const backendOrderData = {
			...orderData,
			user: userId,
			total_price: totalPrice.toFixed(2)
		};

		const backendResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/order/create/`, {
			method: 'POST',
			headers: {
				'Authorization': finalAuthHeader,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(backendOrderData)
		});

		if (!backendResponse.ok) {
			const errorData = await backendResponse.json();
			return json(
				{ error: errorData.error || 'Failed to create order' },
				{ status: backendResponse.status }
			);
		}

		const order = await backendResponse.json();
		return json(order, { status: 201 });
	} catch (error) {
		console.error('Order creation API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};