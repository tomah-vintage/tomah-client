import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	const { phone, purpose = 'login' } = await request.json();

	try {
		const backendResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/otp/send/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone, purpose })
		});

		const data = await backendResponse.json();

		if (!backendResponse.ok) {
			return json(
				{ error: data.error || 'Failed to send OTP' },
				{ status: backendResponse.status }
			);
		}

		return json({ 
			success: true, 
			message: data.message || 'OTP sent successfully' 
		});
	} catch (error) {
		console.error('OTP send API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};