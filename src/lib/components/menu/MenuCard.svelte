<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import { Plus } from 'lucide-svelte';
	import Model from '../order/OrderModel.svelte';
	import MenuItemDetail from './MenuItemDetail.svelte';

	export let item: MenuItem;
	export let restaurantId: number;

	let showModal = false;

	const openModal = () => (showModal = true);
	const closeModal = () => (showModal = false);


</script>

<div class="relative flex w-[280px] cursor-pointer flex-col gap-1 rounded-2xl bg-white shadow-md 
	hover:shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02]
	">
	<button
		on:click={openModal}
		class="absolute top-1/2 right-6 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md 
		hover:bg-white hover:shadow-lg
		transition-all duration-200 transform hover:scale-110"
		aria-label="Add {item.name} to cart"
	>
		<Plus size={24} class="text-primary" />
	</button>
	<img src={item.img_urls[0]} alt={item.name} class="h-[220px] w-[280px] rounded-t-2xl object-cover" />
	<div class="px-5 py-3.5">
		<p class="font-bold">{item.name}</p>
		<p class="mb-4 text-xs text-gray-500">{item.description}</p>
		<p class="align-end font-semibold text-primary">{item.price}₮</p>
	</div>
</div>

<Model open={showModal} onClose={closeModal} width="600px">
	<MenuItemDetail item={item} onClose={closeModal} restaurantId={restaurantId} />
</Model>
