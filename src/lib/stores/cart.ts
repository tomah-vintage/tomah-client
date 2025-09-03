import { writable, get } from 'svelte/store';
import type { CartItem } from '$lib/types/cart';
import { browser } from '$app/environment';

const createCart = () => {
	const initialValue: CartItem[] = browser ? JSON.parse(localStorage.getItem('cart') || '[]') : [];
	const { subscribe, set, update } = writable<CartItem[]>(initialValue);

	const syncWithLocalStorage = (items: CartItem[]) => {
		if (browser) {
			localStorage.setItem('cart', JSON.stringify(items));
		}
	};

	const addItem = (itemToAdd: Omit<CartItem, 'quantity'>) => {
		update((items) => {
			const existingItem = items.find((i) => i.id === itemToAdd.id);
			let newItems;
			if (existingItem) {
				newItems = items.map((i) =>
					i.id === itemToAdd.id ? { ...i, quantity: i.quantity + 1 } : i
				);
			} else {
				newItems = [...items, { ...itemToAdd, quantity: 1 }];
			}
			syncWithLocalStorage(newItems);
			return newItems;
		});
	};

	const removeItem = (itemId: string) => {
		update((items) => {
			const newItems = items.filter((i) => i.id !== itemId);
			syncWithLocalStorage(newItems);
			return newItems;
		});
	};

	const updateQuantity = (itemId: string, quantity: number) => {
		update((items) => {
			if (quantity <= 0) {
				return items.filter((i) => i.id !== itemId);
			}
			const newItems = items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
			syncWithLocalStorage(newItems);
			return newItems;
		});
	};

	const clearCart = () => {
		set([]);
		syncWithLocalStorage([]);
	};

	return {
		subscribe,
		addItem,
		removeItem,
		updateQuantity,
		clearCart
	};
};

export const cart = createCart();

export const cartTotal = writable(0);
cart.subscribe((items) => {
	const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
	cartTotal.set(total);
});

export const cartQuantity = writable(0);
cart.subscribe((items) => {
	const quantity = items.reduce((acc, item) => acc + item.quantity, 0);
	cartQuantity.set(quantity);
});