<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantList from './RestaurantList.svelte';

	interface RestaurantHighlight {
		id: number;
		name: string;
		display_name: string;
		highlight_type: string;
		highlight_type_display: string;
		color: string;
		icon: string | null;
		is_active: boolean;
		order_index: number;
		restaurants: Restaurant[];
		created_at: string;
		updated_at: string;
	}

	export let highlights: RestaurantHighlight[] = [];
</script>

<div class="flex flex-col gap-4.5">
	{#if highlights.length > 0}
		{#each highlights as highlight}
			<div class="mb-6">
				<h2 class="text-xl font-semibold mb-4 text-black">
					{highlight.display_name}
				</h2>
				<RestaurantList restaurants={highlight.restaurants} />
			</div>
		{/each}
	{:else}
		<div class="text-gray-500 text-center py-8">No featured restaurants available</div>
	{/if}
</div>
