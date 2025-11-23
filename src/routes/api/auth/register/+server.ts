import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	const { lastName, firstName, email, password } = await request.json();

	try {
		const externalApiResponse = await fetch(`${PUBLIC_BACKEND_URL}/api/users/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				last_name: lastName,
				first_name: firstName,
				email,
				password,
				role: 3
			})
		});

		if (externalApiResponse.ok) {
			await externalApiResponse.json();

			return json({ message: 'Registration successful' }, { status: 200 });
		} else {
			const { error: errorMessage } = await externalApiResponse.json();
			return json({ error: errorMessage }, { status: externalApiResponse.status });
		}
	} catch (e) {
		return json({ error: 'Registration failed. Please try again.' }, { status: 500 });
	}
};
