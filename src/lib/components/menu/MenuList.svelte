<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import MenuCard from './MenuCard.svelte';

	export let items: MenuItem[];
	export let limit = 4;

	function loadMore() {
		limit += 4;
	}
</script>

<div class="mt-4">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
		{#each items.slice(0, limit) as item}
			<MenuCard {item} />
		{/each}
	</div>
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

{#if items.length < 1}
<div class="w-[280px] h-[180px] flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-300 text-gray-500 shadow-sm">
	<p class="text-sm">Хоол байхгүй байна</p>
  </div>
{/if}
