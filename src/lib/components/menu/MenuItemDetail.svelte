<script lang="ts">
	import type { MenuItem } from "$lib/types/menu";
    import { cart } from '$lib/stores/cart';

	export let item: MenuItem
    export let onClose = () => {};

    let quantity = 1;

    const increase = () => quantity++;
    const decrease = () => {
        if (quantity > 1) quantity--;
    };

    function addToCart() {
		cart.addItem(item, quantity);
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
				<h3 class="font-semibold">{item.name}</h3>
				<p class="mt-1 text-sm text-gray-600">{item.description}</p>
			</div>

			<!-- Quantity + Price -->
			<div class="mt-4 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<button class="rounded bg-gray-200 px-3 py-1" on:click={decrease}>-</button>
					<span>{quantity}</span>
					<button class="rounded bg-gray-200 px-3 py-1" on:click={increase}>+</button>
				</div>

				<p class="text-lg font-bold text-red-500">
					{(item.price * quantity).toLocaleString()}₮
				</p>
			</div>

			<!-- Add to Cart Button -->
			<button on:click={addToCart} class="mt-4 w-full rounded-lg bg-red-500 py-3 text-white hover:bg-red-600">
				Сагсанд хийх
			</button>
		</div>
	</div>