import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This is a mock database. In a real application, you'd use a proper database.
const orders: any[] = [];

export const POST: RequestHandler = async ({ request, locals }) => {
	// In a real app, you would get the user from a proper auth system.
	// Here we are assuming the user is on locals, put there by a hook.
	const user = (locals as any).user;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { items, restaurantId, totalPrice } = await request.json();

		if (!items || !restaurantId || !totalPrice) {
			return json({ error: 'Invalid order data' }, { status: 400 });
		}

		const newOrder = {
			id: `order-${Date.now()}`,
			userId: user.id,
			restaurantId,
			items,
			totalPrice,
			status: 'PENDING',
			createdAt: new Date().toISOString(),
		};

		orders.push(newOrder);

		return json(newOrder, { status: 201 });
	} catch (error) {
		console.error('Error creating order:', error);
		return json({ error: 'Failed to create order' }, { status: 500 });
	}
};
