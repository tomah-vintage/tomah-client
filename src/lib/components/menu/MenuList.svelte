<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import type { Restaurant } from '$lib/types/restaurant';
	import MenuCard from './MenuCard.svelte';

	export let items: MenuItem[];
	export let restaurantId: number;
	export let restaurant: Restaurant | null = null;
</script>

<div class="mt-4">
	<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
		{#each items as item}
			<MenuCard {item} {restaurantId} {restaurant} />
		{/each}
	</div>
</div>

{#if items.length < 1}
<div class="w-[280px] h-[180px] flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-300 text-gray-500 shadow-sm">
	<p class="text-sm">Хоол байхгүй байна</p>
  </div>
{/if}
