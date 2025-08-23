<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import MenuCard from './MenuCard.svelte';

	export let items: MenuItem[];
	export let limit = 2;

	function loadMore() {
		limit += 2;
	}
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each items.slice(0, limit) as item}
		<MenuCard {item} />
	{/each}
</div>

{#if limit < items.length}
	<div class="mt-4 text-center">
		<button
			on:click={loadMore}
			class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>
			Load More
		</button>
	</div>
{/if}
