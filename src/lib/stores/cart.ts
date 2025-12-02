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

	const addItem = (itemToAdd: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
		update((items) => {
			const existingItem = items.find((i) => i.id === itemToAdd.id);
			let newItems;
			const qty = Math.max(1, quantity);
			if (existingItem) {
				// Update existing item: preserve or update is_takeout, and increment quantity
				newItems = items.map((i) =>
					i.id === itemToAdd.id ? { ...i, ...itemToAdd, quantity: i.quantity + qty } : i
				);
			} else {
				// Add new item with all properties including is_takeout
				newItems = [...items, { ...itemToAdd, quantity: qty }];
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
			let newItems;
			if (quantity <= 0) {
				newItems = items.filter((i) => i.id !== itemId);
			} else {
				newItems = items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
			}
			syncWithLocalStorage(newItems);
			return newItems;
		});
	};

	const clearCart = () => {
		set([]);
		syncWithLocalStorage([]);
	};

	const toggleItemTakeout = (itemId: string, isTakeout: boolean) => {
		update((items) => {
			const newItems = items.map((i) => (i.id === itemId ? { ...i, is_takeout: isTakeout } : i));
			syncWithLocalStorage(newItems);
			return newItems;
		});
	};

	return {
		subscribe,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		toggleItemTakeout,
		initialValue
	};
};

export const cart = createCart();

export const { addItem, removeItem, updateQuantity, clearCart, toggleItemTakeout } = cart;

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
