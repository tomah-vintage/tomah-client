<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import SearchResultCard from './SearchResultCard.svelte';

	export let results: SearchResultItem[] = [];
</script>

<div class="search-results-list">
	<div class="grid-cols-auto-fill-minmax-280px grid gap-6">
		{#each results as item (item.id)}
			<SearchResultCard {item} />
		{/each}
	</div>
</div>

<style>
</style>
