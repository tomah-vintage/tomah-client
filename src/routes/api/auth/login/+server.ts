import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = await request.json();

	try {
		const backendResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/token/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (!backendResponse.ok) {
			const errorData = await backendResponse.json();
			return json(
				{ error: errorData.message || 'Authentication failed' },
				{ status: backendResponse.status }
			);
		}

		const { access, refresh } = await backendResponse.json();

		cookies.set('token', access, {
			path: '/',
			httpOnly: false,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		if (refresh) {
			cookies.set('refresh_token', refresh, {
				path: '/',
				httpOnly: false,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
		}

		return json({ success: true, token: access });
	} catch (error) {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
