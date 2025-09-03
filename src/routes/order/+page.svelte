<script lang="ts">
	import type { PageData } from './$types';
	import { order, removeFromOrder, updateQuantity } from '$lib/stores/order';

	function handleRemove(itemId: string) {
		removeFromOrder(itemId);
	}

	function handleUpdateQuantity(itemId: string, quantity: number) {
		updateQuantity(itemId, quantity);
	}
</script>

<svelte:head>
	<title>Your Order | Tomah</title>
	<meta name="description" content="Your current order" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-center text-3xl font-bold">Your Order</h1>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="rounded-lg bg-white p-6 shadow-lg md:col-span-2">
				{#if $order.items.length === 0}
					<p class="text-gray-500">Your order is empty.</p>
				{:else}
					<ul>
						{#each $order.items as item}
							<li class="flex items-center justify-between border-b py-4">
								<div class="flex items-center">
									<img
										src={item.img_urls}
										alt={item.name}
										class="mr-4 h-20 w-20 rounded-lg object-cover"
									/>
									<div>
										<p class="text-lg font-bold">{item.name}</p>
										<p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
									</div>
								</div>
								<div class="flex items-center">
									<input
										type="number"
										min="1"
										value={item.quantity}
										on:change={(e) => handleUpdateQuantity(item.id, e.currentTarget.valueAsNumber)}
										class="input input-bordered mr-4 w-20 text-center"
									/>
									<button class="btn btn-outline btn-error" on:click={() => handleRemove(item.id)}
										>Remove</button
									>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="md:col-span-1">
				<div class="rounded-lg bg-white p-6 shadow-lg">
					<h2 class="mb-4 text-2xl font-bold">Order Summary</h2>
					<div class="flex items-center justify-between border-b py-2">
						<p>Subtotal</p>
						<p>${$order.total.toFixed(2)}</p>
					</div>
					<div class="flex items-center justify-between border-b py-2">
						<p>Tax</p>
						<p>$0.00</p>
					</div>
					<div class="mt-4 flex items-center justify-between text-lg font-bold">
						<p>Total</p>
						<p>${$order.total.toFixed(2)}</p>
					</div>
					<button class="btn btn-primary mt-6 w-full bg-[#FF6B35] text-white">Checkout</button>
				</div>
			</div>
		</div>
	</div>
</div>
