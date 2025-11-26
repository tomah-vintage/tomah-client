<script lang="ts">
	import { cart, cartTotal, clearCart, updateQuantity, removeItem } from '$lib/stores/cart';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import Button from '../common/Button.svelte';
	import Card from '../common/Card.svelte';
	import { X, Trash2 } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

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
					<div class="flex items-center justify-between">
						<div>
							<p class="font-semibold">{item.name}</p>
							<p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
							{#if item.order_type}
								<span
									class="rounded-full px-2 py-0.5 text-xs {item.order_type === 'DINE_IN'
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
							<button on:click={() => removeItem(item.id)} class="text-red-500 hover:text-red-700">
								<Trash2 size={16} />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if $cart.length > 0}
		<div class="mt-4 space-y-4 border-t pt-4">
			<div class="flex justify-between text-lg font-bold">
				<span>Total</span>
				<span>${$cartTotal.toFixed(2)}</span>
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
