<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { SearchQuery } from '$lib/types/search';

	const dispatch = createEventDispatcher<{ change: Partial<SearchQuery> }>();

	let selectedSortBy: string = 'relevance';
	let selectedFilter: string = 'all';

	function applyChanges() {
		const newFilters: Record<string, string> = {};
		if (selectedFilter !== 'all') {
			newFilters.type = selectedFilter;
		}
		dispatch('change', {
			sortBy: selectedSortBy,
			filters: newFilters
		});
	}
</script>

<div class="mt-4 flex items-center gap-4">
	<label for="sort-by" class="font-bold text-gray-600">Sort By:</label>
	<select
		id="sort-by"
		bind:value={selectedSortBy}
		on:change={applyChanges}
		class="rounded border border-gray-300 bg-gray-100 p-2 text-gray-900"
	>
		<option value="relevance">Relevance</option>
		<option value="rating">Rating</option>
		<option value="distance">Distance</option>
	</select>

	<label for="filter-by" class="font-bold text-gray-600">Filter By:</label>
	<select
		id="filter-by"
		bind:value={selectedFilter}
		on:change={applyChanges}
		class="rounded border border-gray-300 bg-gray-100 p-2 text-gray-900"
	>
		<option value="all">All</option>
		<option value="restaurant">Restaurants</option>
		<option value="menuItem">Menu Items</option>
	</select>
</div>

<style>
</style>
