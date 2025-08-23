import { writable } from 'svelte/store';
import type { MenuItem } from '$lib/types/menu';

export interface OrderItem extends MenuItem {
	quantity: number;
}

export interface Order {
	items: OrderItem[];
	total: number;
}

const initialOrder: Order = {
	items: [],
	total: 0
};

export const order = writable<Order>(initialOrder);

export function addToOrder(item: MenuItem) {
	order.update((currentOrder) => {
		const existingItem = currentOrder.items.find((i) => i.id === item.id);

		if (existingItem) {
			existingItem.quantity++;
		} else {
			currentOrder.items.push({ ...item, quantity: 1 });
		}

		currentOrder.total += item.price;

		return currentOrder;
	});
}

export function removeFromOrder(itemId: string) {
	order.update((currentOrder) => {
		const itemToRemove = currentOrder.items.find((i) => i.id === itemId);

		if (itemToRemove) {
			currentOrder.total -= itemToRemove.price * itemToRemove.quantity;
			currentOrder.items = currentOrder.items.filter((i) => i.id !== itemId);
		}

		return currentOrder;
	});
}

export function updateQuantity(itemId: string, quantity: number) {
	order.update((currentOrder) => {
		const itemToUpdate = currentOrder.items.find((i) => i.id === itemId);

		if (itemToUpdate) {
			currentOrder.total -= itemToUpdate.price * itemToUpdate.quantity;
			itemToUpdate.quantity = quantity;
			currentOrder.total += itemToUpdate.price * itemToUpdate.quantity;
		}

		return currentOrder;
	});
}
