<script lang="ts">
	import type { MenuItem } from "$lib/types/menu";
    import { cart } from '$lib/stores/cart';

	export let item: MenuItem
    export let onClose = () => {};
	export let restaurantId: number;

    let quantity = 1;

    const increase = () => quantity++;
    const decrease = () => {
        if (quantity > 1) quantity--;
    };

    function addToCart() {
		cart.addItem({...item, restaurant_id: restaurantId }, quantity);
		onClose()
	}

</script>
<!-- Title -->
	<h2 class="mb-4 text-lg font-bold">Дэлгэрэнгүй</h2>

	<div class="flex gap-6">
		<!-- Product Image -->
		<img src={item.img_urls[0]} alt={item.img_urls} class="h-48 w-48 rounded-lg object-cover" />

		<!-- Product Info -->
		<div class="flex flex-1 flex-col justify-between">
			<div>
				<div class="flex items-center gap-2">
					<h3 class="font-semibold">{item.name}</h3>
					{#if !item.is_available}
						<span class="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">Дууссан</span>
					{/if}
				</div>
				<p class="mt-1 text-sm text-gray-600">{item.description}</p>
			</div>

			<!-- Quantity + Price -->
			<div class="mt-4 flex items-center justify-between">
				{#if item.is_available}
					<div class="flex items-center gap-2">
						<button class="rounded bg-gray-200 px-3 py-1" on:click={decrease}>-</button>
						<span>{quantity}</span>
						<button class="rounded bg-gray-200 px-3 py-1" on:click={increase}>+</button>
					</div>
				{:else}
					<div class="flex items-center gap-2 opacity-50">
						<button disabled class="rounded bg-gray-200 px-3 py-1 cursor-not-allowed">-</button>
						<span>1</span>
						<button disabled class="rounded bg-gray-200 px-3 py-1 cursor-not-allowed">+</button>
					</div>
				{/if}

				<p class="text-lg font-bold text-red-500">
					{(item.price * quantity).toLocaleString()}₮
				</p>
			</div>

			<!-- Add to Cart Button -->
			{#if item.is_available}
				<button on:click={addToCart} class="mt-4 w-full rounded-lg bg-red-500 py-3 text-white hover:bg-red-600">
					Сагсанд хийх
				</button>
			{:else}
				<button disabled class="mt-4 w-full rounded-lg bg-gray-400 py-3 text-white cursor-not-allowed">
					Дууссан байна
				</button>
			{/if}
		</div>
	</div>