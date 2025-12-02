<script lang="ts">
	import { cartTotal, cart, toggleItemTakeout } from '$lib/stores/cart';
	import type { CartItem } from '$lib/types/cart';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { currentTable } from '$lib/stores/table';
	import { createRestaurantQuery } from '$lib/stores/restaurantQuery';
	import Modal from '$lib/components/common/Modal.svelte';
	import OTPLogin from '$lib/components/auth/OTPLogin.svelte';
	import OTPRegister from '$lib/components/auth/OTPRegister.svelte';
	import ItemTakeoutToggle from '$lib/components/cart/ItemTakeoutToggle.svelte';
	import { Package } from 'lucide-svelte';

	export let onClose: () => {};

	// Check if user is at a table
	$: isAtTable = $currentTable !== null;

	// Fetch restaurant data to get container price
	$: restaurantId = $cart[0]?.restaurant_id;
	$: restaurantQuery = restaurantId ? createRestaurantQuery(restaurantId) : null;
	$: restaurant = $restaurantQuery?.data;
	$: containerPrice = restaurant?.takeout_container_price || 2000;

	// Calculate total container fees
	$: containerFees = $cart.reduce((sum, item) => {
		return sum + (item.is_takeout ? item.quantity * containerPrice : 0);
	}, 0);

	// Calculate total including container fees
	$: totalWithFees = $cartTotal + containerFees;
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

		// Close modal and navigate to payment page
		onClose && onClose();
		goto('/payment');
	}
</script>

<h2 class="mb-4 text-xl font-bold">Сагс</h2>

<!-- Cart items -->
<div class="space-y-4">
	{#each $cart as item}
		<div class="space-y-2 rounded-lg border border-gray-200 p-3">
			<div class="flex items-center gap-3">
				<img src={item.img_urls[0]} class="h-16 w-16 rounded-lg object-cover" alt="food" />
				<div class="flex-1">
					<div class="flex items-center gap-2">
						<p class="font-medium">{item.name}</p>
						{#if item.is_takeout}
							<span
								class="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700"
							>
								<Package class="h-3 w-3" />
								Савтай
							</span>
						{/if}
					</div>
					<div class="mt-1 flex items-center gap-2">
						<p class="font-semibold text-red-500">{item.price.toLocaleString()}₮</p>
						{#if item.is_takeout}
							<span class="text-xs text-red-600"
								>+ сав {(item.quantity * containerPrice).toLocaleString()}₮</span
							>
						{/if}
					</div>
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

			<!-- Takeout toggle (only show for table orders) -->
			{#if isAtTable}
				<ItemTakeoutToggle
					isChecked={item.is_takeout || false}
					{containerPrice}
					quantity={item.quantity}
					onToggle={(checked) => toggleItemTakeout(item.id, checked)}
				/>
			{:else}
				<!-- For online orders, show takeout status (non-editable) -->
				<div class="flex items-center justify-between rounded-lg bg-red-50 p-2">
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							checked={item.is_takeout || false}
							disabled
							class="h-4 w-4 rounded border-gray-300 text-red-500 opacity-50"
						/>
						<Package class="h-4 w-4 text-red-600" />
						<span class="text-sm font-medium text-red-700">Авч явах (онлайн)</span>
					</div>
					{#if item.is_takeout}
						<span class="text-sm font-medium text-red-600"
							>+{(item.quantity * containerPrice).toLocaleString()}₮</span
						>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>

<!-- Footer -->
<div class="mt-6">
	<p class="font-semibold">Төлбөрийн дэлэгрэнгүй</p>
	<div class="mt-6 flex justify-between text-sm text-slate-700">
		<span>Хоолны дүн:</span>
		<span>{$cartTotal.toLocaleString()}₮</span>
	</div>

	{#if containerFees > 0}
		<div class="mt-2 flex justify-between text-sm text-red-600">
			<span>Савны төлбөр:</span>
			<span>+{containerFees.toLocaleString()}₮</span>
		</div>
	{/if}

	<div class="mt-2 flex justify-between text-sm text-slate-700">
		<span>Хямдрал:</span>
		<span>-0₮</span>
	</div>
	<div
		class="mt-2 flex justify-between border-t border-slate-200 pt-4 font-semibold text-slate-700"
	>
		<span>Төлөх дүн:</span>
		<span>{totalWithFees.toLocaleString()}₮</span>
	</div>

	{#if orderError}
		<div class="mt-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<p class="text-sm">{orderError}</p>
		</div>
	{/if}

	<button
		disabled={$cart.length < 1}
		class="mt-4 w-full rounded-lg bg-red-500 py-3 text-white hover:bg-red-600 disabled:bg-red-400"
		on:click={handlePay}
	>
		Төлбөр төлөх
	</button>
</div>

<Modal showModal={showLoginModal} on:close={() => (showLoginModal = false)}>
	<OTPLogin on:openRegister={handleOpenRegister} on:close={() => (showLoginModal = false)} />
</Modal>

<Modal showModal={showRegisterModal} on:close={() => (showRegisterModal = false)}>
	<OTPRegister on:switchToLogin={handleOpenLogin} on:close={() => (showRegisterModal = false)} />
</Modal>
