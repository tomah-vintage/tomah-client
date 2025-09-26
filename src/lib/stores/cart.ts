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
				newItems = items.map((i) => (i.id === itemToAdd.id ? { ...i, quantity: i.quantity + qty } : i));
			} else {
				newItems = [...items, { ...itemToAdd, quantity: qty }];
			}
			syncWithLocalStorage(newItems);
			return newItems;
		});
	};

	const removeItem = (itemId: string) => {
		update((items) => {
			console.log('Removing item with ID:', itemId);
			console.log('Current items:', items.map(i => ({ id: i.id, name: i.name })));
			const newItems = items.filter((i) => {
				const shouldKeep = i.id !== itemId;
				if (!shouldKeep) {
					console.log('Found and removing item:', i.name);
				}
				return shouldKeep;
			});
			console.log('Items after removal:', newItems.map(i => ({ id: i.id, name: i.name })));
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

	return {
		subscribe,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		initialValue
	};
};

export const cart = createCart();

export const { addItem, removeItem, updateQuantity, clearCart } = cart;

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