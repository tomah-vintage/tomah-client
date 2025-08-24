<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import { cartStore } from '$lib/stores/cart';
	import { Plus } from 'lucide-svelte';

	export let item: MenuItem;

	function addToCart() {
		cartStore.addItem(item);
	}
</script>

<div class="w-[280px] relative flex cursor-pointer flex-col gap-1 rounded-2xl bg-white shadow-md">
	<button
			on:click={addToCart}
			class="focus:ring-primary-light absolute shadow-[#DC2625] shadow-sm top-1/2 right-6 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
		>
			<Plus size={24} class="text-[#DC2625]" />
		</button>
	<img src={item.img_urls[0]} alt={item.name} class="w-[280px] h-[220px] object-cover rounded-t-2xl"/>
	<div class="px-5 py-3.5">
		<p class="font-bold text-lg">{item.name}</p>
		<p class="text-slate-500 mb-4 text-xs">{item.description}</p>
		<p class="align-end font-semibold text-[#DC2625]">{item.price}₮</p>
	</div>
</div>
