<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import MenuCard from './MenuCard.svelte';

	export let items: MenuItem[];
</script>

<div class="mb-4">
	<p class="text-lg font-bold mt-7 mb-2">Онцлох бүтээгдэхүүн</p>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
		{#each items as item}
			<MenuCard {item} />
		{/each}
	</div>
</div>
