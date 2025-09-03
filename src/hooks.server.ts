import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// This is a mock user for demonstration purposes.
	// In a real application, you would have a proper authentication system.
	(event.locals as any).user = {
		id: 'user-123',
		name: 'Test User',
		email: 'test@example.com'
	};

	const response = await resolve(event);
	return response;
};
