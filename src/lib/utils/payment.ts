import type { CartItem } from '$lib/types/cart';

export interface PaymentCalculation {
	cartTotal: number;
	appliedPackagingFee: number;
	finalAmount: number;
}

export function calculatePaymentTotal(
	cart: CartItem[],
	orderType: 'TAKE_OUT' | 'DINE_IN',
	discount: number = 0
): PaymentCalculation {
	const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// Calculate per-item container fees based on is_takeout flag and item's container_price
	const appliedPackagingFee = cart.reduce((sum, item) => {
		return sum + (item.is_takeout ? item.quantity * (item.container_price || 0) : 0);
	}, 0);

	const finalAmount = Math.max(0, cartTotal - discount + appliedPackagingFee);

	return {
		cartTotal,
		appliedPackagingFee,
		finalAmount
	};
}

export function shouldShowPackagingFee(orderType: 'TAKE_OUT' | 'DINE_IN'): boolean {
	return orderType === 'TAKE_OUT';
}

export function getDefaultOrderType(hasTable: boolean): 'TAKE_OUT' | 'DINE_IN' {
	return hasTable ? 'DINE_IN' : 'TAKE_OUT';
}
