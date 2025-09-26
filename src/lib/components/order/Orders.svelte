<script lang="ts">
	import { cartTotal, cart } from '$lib/stores/cart';
	import type { CartItem } from '$lib/types/cart';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { createOrder, redirectToPayment, type CreateOrderRequest } from '$lib/utils/order';
	import Modal from '$lib/components/common/Modal.svelte';
	import OTPLogin from '$lib/components/auth/OTPLogin.svelte';
	import OTPRegister from '$lib/components/auth/OTPRegister.svelte';

	export let onClose: () => {};
	let showLoginModal = false;
	let showRegisterModal = false;

	function handleOpenRegister() {
		showLoginModal = false;
		showRegisterModal = true;
	}

	function handleOpenLogin() {
		showRegisterModal = false;
		showLoginModal = true;
	}

	const increaseItemQuantity = (item: CartItem) => () => {
		cart.updateQuantity(item.id, item.quantity + 1);
	};

	const decreaseItemQuantity = (item: CartItem) => () => {
		cart.updateQuantity(item.id, item.quantity - 1);
	};

	let isProcessingOrder = false;
	let orderError = '';

	async function handlePay() {
		// Check authentication
		if (!$authStore.isAuthenticated) {
			return handleOpenLogin();
		}

		if ($cart.length === 0) {
			orderError = 'Сагс хоосон байна';
			return;
		}

		isProcessingOrder = true;
		orderError = '';

		try {
			// Build order data according to new API format
			const items = $cart.map((item) => ({
				menu_item: item.id,
				quantity: item.quantity,
				unit_price: item.price.toString()
			}));

			const orderData: CreateOrderRequest = {
				restaurant: $cart[0].restaurant_id,
				order_type: 'TAKE_OUT', // Default to take out, could be configurable
				items
			};

			const result = await createOrder(orderData);

			if (result.success && result.order) {
				// Clear cart on successful order creation
				cart.clearCart();
				
				// Close modal
				onClose && onClose();

				// Redirect to payment if payment URL is provided
				if (result.order.payment?.payment_url) {
					redirectToPayment(result.order.payment.payment_url);
				} else {
					// Fallback: go to order success page
					goto(`/order/${result.order.id}`);
				}
			} else {
				orderError = result.error || 'Захиалга үүсгэхэд алдаа гарлаа';
			}
		} catch (error) {
			console.error('Order creation failed:', error);
			orderError = 'Сүлжээний алдаа гарлаа';
		} finally {
			isProcessingOrder = false;
		}
	}
</script>

<h2 class="mb-4 text-xl font-bold">Сагс</h2>

<!-- Example cart content -->
<div class="space-y-4">
	{#each $cart as item}
		<div class="flex items-center gap-3 border-b border-slate-200 pb-3">
			<img src={item.img_urls[0]} class="h-16 w-16 rounded-lg object-cover" alt="food" />
			<div class="flex-1">
				<p class="font-medium">{item.name}</p>
				<p class="font-semibold text-red-500">{item.price}₮</p>
			</div>
			<div class="flex items-center gap-2">
				<button on:click={decreaseItemQuantity(item)} class="rounded bg-gray-200 px-2 py-1"
					>-</button
				>
				<span>{item.quantity}</span>
				<button on:click={increaseItemQuantity(item)} class="rounded bg-gray-200 px-2 py-1"
					>+</button
				>
			</div>
		</div>
	{/each}
</div>

<!-- Footer -->
<div class="mt-6">
	<p class="font-semibold">Төлбөрийн дэлэгрэнгүй</p>
	<div class="mt-6 flex justify-between text-sm text-slate-700">
		<span>Нийт дүн:</span>
		<span>{$cartTotal.toLocaleString()}₮</span>
	</div>

	<div class="mt-2 flex justify-between text-sm text-slate-700">
		<span>Хямдрал:</span>
		<span>-0₮</span>
	</div>
	<div
		class="mt-2 flex justify-between border-t border-slate-200 pt-4 font-semibold text-slate-700"
	>
		<span>Төлөх дүн:</span>
		<span>{$cartTotal.toLocaleString()}₮</span>
	</div>

	{#if orderError}
		<div class="mt-4 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
			<p class="text-sm">{orderError}</p>
		</div>
	{/if}

	<button
		disabled={$cart.length < 1 || isProcessingOrder}
		class="mt-4 w-full rounded-lg bg-red-500 py-3 text-white hover:bg-red-600 disabled:bg-red-400 flex items-center justify-center"
		on:click={handlePay}
	>
		{#if isProcessingOrder}
			<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
			Захиалга үүсгэж байна...
		{:else}
			Төлбөр төлөх
		{/if}
	</button>
</div>

<Modal showModal={showLoginModal} on:close={() => (showLoginModal = false)}>
	<OTPLogin on:openRegister={handleOpenRegister} on:close={() => (showLoginModal = false)} />
</Modal>

<Modal showModal={showRegisterModal} on:close={() => (showRegisterModal = false)}>
	<OTPRegister on:switchToLogin={handleOpenLogin} on:close={() => (showRegisterModal = false)} />
</Modal>
