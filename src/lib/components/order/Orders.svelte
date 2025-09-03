<script lang="ts">
	import { cartTotal, cart } from '$lib/stores/cart';
	import type { CartItem } from '$lib/types/cart';
	import { goto } from '$app/navigation';

	export let onClose :()=>{}

	let orderItems = cart.initialValue;

	// console.log($cartTotal); // uncomment if you want to observe changes

	// export let orderItems = [];

	const increaseItemQuantity = (item: CartItem) => () => {
		cart.updateQuantity(item.id, item.quantity + 1);
	};

	const decreaseItemQuantity = (item: CartItem) => () => {
		cart.updateQuantity(item.id, item.quantity - 1);
	};

	function handlePay() {
		goto('/payment');
		onClose()
	}
</script>

<h2 class="mb-4 text-xl font-bold">Сагс</h2>

<!-- Example cart content -->
<div class="space-y-4">
	{#each orderItems as item}
		<div class="flex items-center gap-3 border-b pb-3 border-slate-200">
			<img src={item.img_urls[0]} class="h-16 w-16 rounded-lg object-cover" alt="food" />
			<div class="flex-1">
				<p class="font-medium">{item.name}</p>
				<p class="font-semibold text-red-500">{item.price}₮</p>
			</div>
			<div class="flex items-center gap-2">
				<button on:click={increaseItemQuantity(item)} class="rounded bg-gray-200 px-2 py-1"
					>-</button
				>
				<span>{item.quantity}</span>
				<button on:click={decreaseItemQuantity(item)} class="rounded bg-gray-200 px-2 py-1"
					>+</button
				>
			</div>
		</div>
	{/each}
</div>

<!-- Footer -->
<div class="mt-6">
	<p class="font-semibold">Төлбөрийн дэлэгрэнгүй</p>
	<div class="flex justify-between text-sm mt-6 text-slate-700">
		<span>Нийт дүн:</span>
		<span>{$cartTotal.toLocaleString()}₮</span>
	</div>

	
	<div class="flex justify-between text-sm text-slate-700 mt-2">
		<span>Хямдрал:</span>
		<span>-0₮</span>
	</div>
	<div class="mt-2 flex border-t pt-4 border-slate-200 justify-between font-semibold text-slate-700">
		<span>Төлөх дүн:</span>
		<span>{$cartTotal.toLocaleString()}₮</span>
	</div>

	<button class="mt-4 w-full rounded-lg bg-red-500 py-3 text-white hover:bg-red-600" on:click={handlePay}>
		Төлбөр төлөх
	</button>
</div>
