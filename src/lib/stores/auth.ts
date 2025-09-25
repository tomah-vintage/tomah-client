import { writable } from 'svelte/store';
import type { User } from '../types/user';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { apiFetch, getAuthToken } from '$lib/utils/api';

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		isAuthenticated: false,
		user: null,
		loading: true
	});

	async function initialize(): Promise<{ user: User | null; loading: boolean }> {
		const token = getAuthToken();
		if (token) {
			try {
				const user: User = await apiFetch(`${env.PUBLIC_BACKEND_URL}/api/me/`);
				if (user) {
					update((state) => ({ ...state, isAuthenticated: true, user, loading: false }));
					return { user, loading: false };
				} else {
					update((state) => ({ ...state, isAuthenticated: false, user: null, loading: false }));
					return { user: null, loading: false };
				}
			} catch (error) {
				update((state) => ({ ...state, isAuthenticated: false, user: null, loading: false }));
				return { user: null, loading: false };
			}
		} else {
			update((state) => ({ ...state, loading: false }));
			return { user: null, loading: false };
		}
	}

	if (browser) {
		initialize();
	}

	function logout() {
		// Clear cookies
		if (browser) {
			document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
			document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
		}
		// Update store state
		update((state) => ({ ...state, isAuthenticated: false, user: null }));
	}

	return {
		subscribe,
		login: (user: User) => update((state) => ({ ...state, isAuthenticated: true, user })),
		logout,
		set,
		revalidate: initialize
	};
}

export const authStore = createAuthStore();
