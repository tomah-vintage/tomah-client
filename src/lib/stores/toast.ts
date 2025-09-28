import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message?: string;
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		show: (toast: Omit<Toast, 'id'>) => {
			const id = Math.random().toString(36).substr(2, 9);
			const newToast: Toast = {
				...toast,
				id,
				duration: toast.duration ?? 5000
			};

			update(toasts => [...toasts, newToast]);

			// Auto remove after duration
			if (newToast.duration > 0) {
				setTimeout(() => {
					update(toasts => toasts.filter(t => t.id !== id));
				}, newToast.duration);
			}

			return id;
		},
		remove: (id: string) => {
			update(toasts => toasts.filter(t => t.id !== id));
		},
		clear: () => {
			update(() => []);
		}
	};
}

export const toastStore = createToastStore();

// Helper functions for common toast types
export const showSuccess = (title: string, message?: string, duration?: number) => {
	return toastStore.show({ type: 'success', title, message, duration });
};

export const showError = (title: string, message?: string, duration?: number) => {
	return toastStore.show({ type: 'error', title, message, duration });
};

export const showWarning = (title: string, message?: string, duration?: number) => {
	return toastStore.show({ type: 'warning', title, message, duration });
};

export const showInfo = (title: string, message?: string, duration?: number) => {
	return toastStore.show({ type: 'info', title, message, duration });
};