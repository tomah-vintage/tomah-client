<script lang="ts">
	import {
		cart,
		cartTotal,
		clearCart,
		updateQuantity,
		removeItem,
		toggleItemTakeout
	} from '$lib/stores/cart';
	import { authStore } from '$lib/stores/auth';
	import { currentTable } from '$lib/stores/table';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { createRestaurantQuery } from '$lib/stores/restaurantQuery';
	import Button from '../common/Button.svelte';
	import Card from '../common/Card.svelte';
	import ItemTakeoutToggle from './ItemTakeoutToggle.svelte';
	import { X, Trash2, Package } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

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

	let isLoading = false;
	let errorMessage: string | null = null;

	const handlePlaceOrder = async () => {
		if (!$authStore.isAuthenticated) {
			goto('/auth/login');
			return;
		}

		isLoading = true;
		errorMessage = null;

		try {
			const response = await fetch('/api/order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					items: $cart,
					restaurantId: 'clv4kqc9m00001083832pbfyv', // Hardcoded restaurant ID for now
					totalPrice: $cartTotal
				})
			});

			if (response.ok) {
				clearCart();
				dispatch('close');
				// Optionally, show a success message or redirect to an order confirmation page
				goto('/order');
			} else {
				const data = await response.json();
				errorMessage = data.error || 'Failed to place order.';
			}
		} catch (error) {
			errorMessage = 'An unexpected error occurred.';
		} finally {
			isLoading = false;
		}
	};
</script>

<div
	class="bg-opacity-50 fixed inset-0 z-40 bg-black"
	aria-hidden="true"
	on:click={() => dispatch('close')}
></div>

<Card
	class="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 shadow-2xl"
>
	<div class="mb-4 flex items-center justify-between border-b pb-4">
		<h2 class="text-2xl font-bold">Your Cart</h2>
		<button on:click={() => dispatch('close')} class="text-gray-500 hover:text-gray-800">
			<X size={20} />
		</button>
	</div>

	<div class="max-h-[60vh] overflow-y-auto">
		{#if $cart.length === 0}
			<p class="py-8 text-center text-gray-500">Your cart is empty.</p>
		{:else}
			<div class="space-y-4">
				{#each $cart as item (item.id)}
					<div class="space-y-2 rounded-lg border border-gray-200 p-3">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<p class="font-semibold">{item.name}</p>
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
									<p class="text-sm text-gray-500">{item.price.toLocaleString()}₮</p>
									{#if item.is_takeout}
										<span class="text-xs text-red-600"
											>+ сав {(item.quantity * containerPrice).toLocaleString()}₮</span
										>
									{/if}
								</div>
								{#if item.order_type}
									<span
										class="mt-1 inline-block rounded-full px-2 py-0.5 text-xs {item.order_type ===
										'DINE_IN'
											? 'bg-blue-100 text-blue-700'
											: 'bg-green-100 text-green-700'}"
									>
										{item.order_type === 'DINE_IN' ? 'Ширээний дээр' : 'Авч явах'}
									</span>
								{/if}
							</div>
							<div class="flex items-center gap-4">
								<div class="flex items-center rounded-md border">
									<button
										on:click={() => updateQuantity(item.id, item.quantity - 1)}
										class="rounded-l-md px-2 py-1 hover:bg-gray-100"
									>
										-
									</button>
									<span class="px-3">{item.quantity}</span>
									<button
										on:click={() => updateQuantity(item.id, item.quantity + 1)}
										class="rounded-r-md px-2 py-1 hover:bg-gray-100"
									>
										+
									</button>
								</div>
								<button
									on:click={() => removeItem(item.id)}
									class="text-red-500 hover:text-red-700"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>

						<!-- Takeout toggle for each item (only show for table orders) -->
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
		{/if}
	</div>

	{#if $cart.length > 0}
		<div class="mt-4 space-y-4 border-t pt-4">
			<div class="space-y-2">
				<div class="flex justify-between text-sm">
					<span>Хоолны дүн:</span>
					<span>{$cartTotal.toLocaleString()}₮</span>
				</div>
				{#if containerFees > 0}
					<div class="flex justify-between text-sm text-red-600">
						<span>Савны төлбөр:</span>
						<span>+{containerFees.toLocaleString()}₮</span>
					</div>
				{/if}
				<div class="flex justify-between text-lg font-bold">
					<span>Төлөх дүн:</span>
					<span>{totalWithFees.toLocaleString()}₮</span>
				</div>
			</div>
			{#if errorMessage}
				<p class="text-center text-sm text-red-500">{errorMessage}</p>
			{/if}
			<Button
				on:click={handlePlaceOrder}
				className="w-full"
				label={isLoading ? 'Placing Order...' : 'Place Order'}
				disabled={isLoading}
			/>
		</div>
	{/if}
</Card>
