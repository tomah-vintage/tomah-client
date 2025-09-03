<script lang="ts">
	import type { SearchResultItem, SearchQuery } from '$lib/types/search';
	import SearchResultsList from './SearchResultsList.svelte';
	import SearchFilterSort from './SearchFilterSort.svelte';

	export let results: SearchResultItem[] = [];
	export let loading = false;
	export let error: string | null = null;
	export let currentQuery: SearchQuery;

	function handleFilterSortChange(event: CustomEvent<Partial<SearchQuery>>) {
		const newQuery = event.detail;
		// Dispatch event or call action to update search
		console.log('Filter/Sort changed:', newQuery);
		// This would typically trigger a new search via searchActions.performSearch
	}
</script>

<div class="p-4">
	<header class="mb-6">
		<h1 class="mb-4 text-3xl">Search Results for "{currentQuery.query}"</h1>
		<SearchFilterSort on:change={handleFilterSortChange} />
	</header>

	<main>
		{#if loading}
			<div class="p-8 text-center text-lg text-gray-600">Loading search results...</div>
		{:else if error}
			<div class="p-8 text-center text-lg text-red-600">Error: {error}</div>
		{:else if results.length === 0}
			<div class="p-8 text-center text-lg text-gray-600">
				<p>No results found for "{currentQuery.query}". Please try a different search term.</p>
			</div>
		{:else}
			<SearchResultsList {results} />
		{/if}
	</main>
</div>

<style>
</style>
