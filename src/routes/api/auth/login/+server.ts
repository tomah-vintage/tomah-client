import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();

  // In a real app, you'd validate the credentials against a database
  if (email === 'test@example.com' && password === 'password') {
    const user = { email };
    return json({ user });
  } else {
    return json({ error: 'Invalid credentials' }, { status: 401 });
  }
};