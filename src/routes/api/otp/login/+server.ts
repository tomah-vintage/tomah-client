import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { phone, password, otp_code } = await request.json();

	try {
		const requestBody: any = {
			phone,
			otp_code
		};

		// Only include password if it's provided
		if (password && password.trim() !== '') {
			requestBody.password = password;
		}

		const backendResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/otp/login/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		if (!backendResponse.ok) {
			const errorData = await backendResponse.json();
			return json(
				{ error: errorData.error || 'Authentication failed' },
				{ status: backendResponse.status }
			);
		}

		const { access, refresh, user_id, message } = await backendResponse.json();

		// Set cookies like the original login endpoint
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

		return json({
			success: true,
			access,
			refresh,
			user_id,
			message: message || 'Login successful'
		});
	} catch (error) {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
