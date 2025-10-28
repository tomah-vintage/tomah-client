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
	class="fixed inset-0 bg-black bg-opacity-50 z-40"
	aria-hidden="true"
	on:click={() => dispatch('close')}
></div>

<Card class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 shadow-2xl">
	<div class="flex justify-between items-center border-b pb-4 mb-4">
		<h2 class="text-2xl font-bold">Your Cart</h2>
		<button on:click={() => dispatch('close')} class="text-gray-500 hover:text-gray-800">
			<X size={20} />
		</button>
	</div>

	<div class="max-h-[60vh] overflow-y-auto">
		{#if $cart.length === 0}
			<p class="text-center text-gray-500 py-8">Your cart is empty.</p>
		{:else}
			<div class="space-y-4">
				{#each $cart as item (item.id)}
					<div class="flex items-center justify-between">
						<div>
							<p class="font-semibold">{item.name}</p>
							<p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
						</div>
						<div class="flex items-center gap-4">
							<div class="flex items-center border rounded-md">
								<button
									on:click={() => updateQuantity(item.id, item.quantity - 1)}
									class="px-2 py-1 hover:bg-gray-100 rounded-l-md"
								>
									-
								</button>
								<span class="px-3">{item.quantity}</span>
								<button
									on:click={() => updateQuantity(item.id, item.quantity + 1)}
									class="px-2 py-1 hover:bg-gray-100 rounded-r-md"
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
		<div class="border-t mt-4 pt-4 space-y-4">
			<div class="flex justify-between font-bold text-lg">
				<span>Total</span>
				<span>${$cartTotal.toFixed(2)}</span>
			</div>
			{#if errorMessage}
				<p class="text-red-500 text-sm text-center">{errorMessage}</p>
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
