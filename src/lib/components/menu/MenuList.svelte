<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import type { Restaurant } from '$lib/types/restaurant';
	import { ChevronDown } from 'lucide-svelte';
	import MenuCard from './MenuCard.svelte';

	export let items: MenuItem[];
	export let limit = 4;
	export let restaurantId: number;
	export let restaurant: Restaurant | null = null;

	function loadMore() {
		limit += 4;
	}
</script>

<div class="mt-4">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
		{#each items.slice(0, limit) as item}
			<MenuCard {item} {restaurantId} {restaurant} />
		{/each}
	</div>
</div>

{#if limit < items.length}
	<div class="mt-8 flex justify-center">
		<button
			on:click={loadMore}
			class="group flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-8 py-3 text-gray-800 font-medium shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:-translate-y-0.5"
		>
			<span class="transition-transform duration-300 group-hover:scale-105">Цааш үзэх</span>
			<ChevronDown size={20} class="transition-transform duration-300 group-hover:scale-105" />
		</button>
	</div>
{/if}

{#if items.length < 1}
<div class="w-[280px] h-[180px] flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-300 text-gray-500 shadow-sm">
	<p class="text-sm">Хоол байхгүй байна</p>
  </div>
{/if}
