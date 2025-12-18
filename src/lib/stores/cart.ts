import { writable, get } from 'svelte/store';
import type { CartItem } from '$lib/types/cart';
import { browser } from '$app/environment';

const createCart = () => {
	// Load cart from localStorage and ensure all items have container_price
	const loadedCart: CartItem[] = browser ? JSON.parse(localStorage.getItem('cart') || '[]') : [];
	const migratedCart = loadedCart.map((item) => ({
		...item,
		container_price: item.container_price ?? 0 // Ensure old items have container_price
	}));
	const initialValue: CartItem[] = migratedCart;
	const { subscribe, set, update } = writable<CartItem[]>(initialValue);

	const syncWithLocalStorage = (items: CartItem[]) => {
		if (browser) {
			localStorage.setItem('cart', JSON.stringify(items));
		}
	};

	const addItem = (itemToAdd: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
		update((items) => {
			// Ensure price and container_price are numbers (convert from string if needed)
			const normalizedItem = {
				...itemToAdd,
				price: typeof itemToAdd.price === 'string' ? parseFloat(itemToAdd.price) : itemToAdd.price,
				container_price:
					typeof itemToAdd.container_price === 'string'
						? parseFloat(itemToAdd.container_price)
						: itemToAdd.container_price || 0
			};

			const existingItem = items.find((i) => i.id === normalizedItem.id);
			let newItems;
			const qty = Math.max(1, quantity);
			if (existingItem) {
				// Update existing item: preserve or update is_takeout, and increment quantity
				newItems = items.map((i) =>
					i.id === normalizedItem.id ? { ...i, ...normalizedItem, quantity: i.quantity + qty } : i
				);
			} else {
				// Add new item with all properties including is_takeout
				newItems = [...items, { ...normalizedItem, quantity: qty }];
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
