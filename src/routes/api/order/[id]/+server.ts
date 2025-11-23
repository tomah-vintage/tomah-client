import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ request, cookies, params }) => {
	try {
		const orderId = params.id;
		if (!orderId) {
			return json({ error: 'Order ID required' }, { status: 400 });
		}

		// Get authorization header from request
		const authHeader = request.headers.get('authorization');

		// Get token from cookies as fallback
		const token = cookies.get('token');
		const finalAuthHeader = authHeader || (token ? `Bearer ${token}` : '');

		if (!finalAuthHeader) {
			return json({ error: 'Authentication token required' }, { status: 401 });
		}

		const backendResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/order/${orderId}/`, {
			method: 'GET',
			headers: {
				Authorization: finalAuthHeader,
				'Content-Type': 'application/json'
			}
		});

		if (!backendResponse.ok) {
			const errorData = await backendResponse.json();
			return json(
				{ error: errorData.error || 'Failed to get order status' },
				{ status: backendResponse.status }
			);
		}

		const order = await backendResponse.json();
		return json(order);
	} catch (error) {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
