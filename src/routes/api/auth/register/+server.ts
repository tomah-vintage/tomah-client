import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();

  // In a real app, you'd create a new user in the database
  // For now, we'll just return a success message
  const user = { email };
  return json({ user });
};