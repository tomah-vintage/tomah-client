<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import MenuCard from './MenuCard.svelte';

	export let items: MenuItem[];
</script>

<div>
	<h2>Featured Items</h2>
	<div class="flex space-x-4 overflow-x-auto">
		{#each items as item}
			<MenuCard {item} />
		{/each}
	</div>
</div>
