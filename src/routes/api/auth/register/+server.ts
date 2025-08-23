import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { users } from '$lib/server/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { email, password, name } = await request.json();

	const existingUser = users.find((user) => user.email === email);
	if (existingUser) {
		return json({ error: 'User already exists' }, { status: 409 });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = {
		id: String(users.length + 1),
		email,
		name,
		role: 'customer' as const,
		password: hashedPassword
	};

	users.push(newUser);

	const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
		expiresIn: '1h'
	});

	return json({ token });
};
