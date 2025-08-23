import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { users } from '$lib/server/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();

	const user = users.find((user) => user.email === email);

	if (!user || !user.password) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
		expiresIn: '1h'
	});

	return json({ token });
};
