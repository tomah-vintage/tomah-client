<script lang="ts">
	import type { PageData } from './$types';
	import SearchResultsList from '$lib/components/search/SearchResultsList.svelte';
	import SearchFilterSort from '$lib/components/search/SearchFilterSort.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
	import { searchStore, searchActions } from '$lib/stores/search';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { parseSearchUrl } from '$lib/utils/search';

	export let data: PageData;

	$: currentQuery = parseSearchUrl($page.url);

	onMount(() => {
		searchActions.performSearch(currentQuery);
	});

	$: if ($page.url.searchParams.get('q') !== $searchStore.currentQuery.query) {
		searchActions.performSearch(currentQuery);
	}

	$: mapLocations = $searchStore.results
		.filter((item) => item.type === 'restaurant' && item.location)
		.map((item) => ({
			lat: item.location!.lat,
			lng: item.location!.lng,
			name: item.name
		}));
</script>

<svelte:head>
	<title>Search Results | Qpick</title>
	<meta name="description" content="Search results for restaurants and menu items on Qpick" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div>
			{#if !$searchStore.loading && $searchStore.results}
				<div class="mb-4">
					<h1 class="text-2xl font-bold">{$searchStore.results.length} илэрц</h1>
				</div>
			{/if}

			<SearchFilterSort />

			<main class="mt-6">
				{#if $searchStore.loading}
					<div class="p-8 text-center text-lg text-gray-600">Loading search results...</div>
				{:else if $searchStore.error}
					<div class="p-8 text-center text-lg text-red-600">Error: {$searchStore.error}</div>
				{:else if !$searchStore.results || $searchStore.results.length === 0}
					<div class="p-8 text-center text-lg text-gray-600">
						<p>No results found for "{currentQuery.query}". Please try a different search term.</p>
					</div>
				{:else}
					<SearchResultsList results={$searchStore.results} />
				{/if}
			</main>
		</div>

		<div class="hidden lg:block" style="height: 716px;">
			<div class="sticky top-24 h-full">
				<Map locations={mapLocations} />
			</div>
		</div>
	</div>
</div>
