import { writable } from 'svelte/store';

export interface AuthState {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a proper user type
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  return {
    subscribe,
    login: (user: any) => update(state => ({ ...state, isAuthenticated: true, user })),
    logout: () => update(state => ({ ...state, isAuthenticated: false, user: null })),
    set,
  };
}

export const authStore = createAuthStore();
