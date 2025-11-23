import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface TableInfo {
	id: string;
	number?: string;
	restaurantId?: number;
}

export interface QROrigin {
	restaurantId: number;
	tableId: string;
	timestamp: number;
}

const createTableStore = () => {
	const initialValue: TableInfo | null = browser
		? JSON.parse(sessionStorage.getItem('currentTable') || 'null')
		: null;

	const { subscribe, set, update } = writable<TableInfo | null>(initialValue);

	const syncWithSessionStorage = (table: TableInfo | null) => {
		if (browser) {
			if (table) {
				sessionStorage.setItem('currentTable', JSON.stringify(table));
			} else {
				sessionStorage.removeItem('currentTable');
			}
		}
	};

	const setTable = (table: TableInfo | null) => {
		set(table);
		syncWithSessionStorage(table);
	};

	const clearTable = () => {
		set(null);
		syncWithSessionStorage(null);
	};

	const updateTable = (updater: (table: TableInfo | null) => TableInfo | null) => {
		update((current) => {
			const newTable = updater(current);
			syncWithSessionStorage(newTable);
			return newTable;
		});
	};

	return {
		subscribe,
		set: setTable,
		clear: clearTable,
		update: updateTable
	};
};

// QR Origin management functions
export const qrOrigin = {
	set: (origin: QROrigin) => {
		if (browser) {
			sessionStorage.setItem('qrOrigin', JSON.stringify(origin));
		}
	},

	get: (): QROrigin | null => {
		if (browser) {
			const stored = sessionStorage.getItem('qrOrigin');
			if (stored) {
				const origin = JSON.parse(stored);
				// Check if QR origin is less than 24 hours old
				const now = Date.now();
				const twentyFourHours = 24 * 60 * 60 * 1000;
				if (now - origin.timestamp < twentyFourHours) {
					return origin;
				} else {
					// Clean up expired QR origin
					sessionStorage.removeItem('qrOrigin');
				}
			}
		}
		return null;
	},

	clear: () => {
		if (browser) {
			sessionStorage.removeItem('qrOrigin');
		}
	},

	getRestaurantUrl: (): string | null => {
		const origin = qrOrigin.get();
		if (origin) {
			return `/restaurant/${origin.restaurantId}?table=${origin.tableId}`;
		}
		return null;
	}
};

export const currentTable = createTableStore();
