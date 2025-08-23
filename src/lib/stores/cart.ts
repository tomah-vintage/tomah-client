import { writable } from 'svelte/store';
import type { MenuItem } from '$lib/types/menu';
import { browser } from '$app/environment';

export interface CartItem {
	item: MenuItem;
	quantity: number;
}

export interface CartState {
	items: CartItem[];
}

function createCartStore() {
	const storedCart = browser && localStorage.getItem('cart');
	const initialCart = storedCart ? JSON.parse(storedCart) : { items: [] };

	const { subscribe, set, update } = writable<CartState>(initialCart);

	subscribe((value) => {
		if (browser) {
			localStorage.setItem('cart', JSON.stringify(value));
		}
	});

	return {
		subscribe,
		addItem: (item: MenuItem) => {
			update((state) => {
				const existingItem = state.items.find((i) => i.item.id === item.id);
				if (existingItem) {
					existingItem.quantity++;
				} else {
					state.items.push({ item, quantity: 1 });
				}
				return state;
			});
		},
		removeItem: (itemId: string) => {
			update((state) => {
				state.items = state.items.filter((i) => i.item.id !== itemId);
				return state;
			});
		},
		updateQuantity: (itemId: string, quantity: number) => {
			update((state) => {
				const existingItem = state.items.find((i) => i.item.id === itemId);
				if (existingItem) {
					existingItem.quantity = quantity;
				}
				return state;
			});
		},
		set
	};
}

export const cartStore = createCartStore();
