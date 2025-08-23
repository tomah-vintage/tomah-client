import { writable } from 'svelte/store';
import type { User } from '../types/user';

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		isAuthenticated: false,
		user: null
	});

	return {
		subscribe,
		login: (user: User) => update((state) => ({ ...state, isAuthenticated: true, user })),
		logout: () => update((state) => ({ ...state, isAuthenticated: false, user: null })),
		set
	};
}

export const authStore = createAuthStore();
