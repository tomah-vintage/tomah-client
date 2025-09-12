<script lang="ts">
	import { cartTotal, cart } from '$lib/stores/cart';
	import type { CartItem } from '$lib/types/cart';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { apiFetch } from '$lib/utils/api';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import Modal from '$lib/components/common/Modal.svelte';
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import RegisterForm from '$lib/components/auth/RegisterForm.svelte';

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

	async function handlePay() {
		// Build payload from current stores
		const userId = $authStore.user?.id;
		if (!userId) return handleOpenLogin();

		const items = $cart.map((i) => ({
			menu_item: i.id,
			quantity: i.quantity,
			unit_price: i.price
		}));
		const payload = {
			user: userId,
			restaurant: $cart[0].restaurant_id,
			order_status: 'PENDING',
			total_price: $cartTotal,
			table: null,
			box: null,
			order_type: 'DINE_IN',
			items
		};

		try {
			await apiFetch(`${PUBLIC_BACKEND_URL}/api/order/`, {
				method: 'POST',
				body: JSON.stringify(payload)
			});
			onClose && onClose();
			goto('/payment');
		} catch (e) {
			console.error('Failed to create order', e);
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

	<button
		disabled={$cart.length < 1}
		class="mt-4 w-full rounded-lg bg-red-500 py-3 text-white hover:bg-red-600 disabled:bg-red-400"
		on:click={handlePay}
	>
		Төлбөр төлөх
	</button>
</div>

<Modal showModal={showLoginModal} on:close={() => (showLoginModal = false)}>
	<LoginForm on:openRegister={handleOpenRegister} on:close={() => (showLoginModal = false)} />
</Modal>

<Modal showModal={showRegisterModal} on:close={() => (showRegisterModal = false)}>
	<RegisterForm on:switchToLogin={handleOpenLogin} on:close={() => (showRegisterModal = false)} />
</Modal>
