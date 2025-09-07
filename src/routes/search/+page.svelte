<script lang="ts">
	import type { PageData } from './$types';
	import SearchResultsList from '$lib/components/search/SearchResultsList.svelte';
	import SearchFilterSort from '$lib/components/search/SearchFilterSort.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
	import { searchStore, searchActions } from '$lib/stores/search';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { parseSearchUrl } from '$lib/utils/search';
	import { List, MapPin } from 'lucide-svelte';

	export let data: PageData;

	let viewMode: 'list' | 'map' = 'list';

	$: currentQuery = parseSearchUrl($page.url);

	onMount(() => {
		searchActions.performSearch(currentQuery);
	});

	$: if ($page.url.searchParams.get('q') !== $searchStore.currentQuery.query) {
		searchActions.performSearch(currentQuery);
	}

	$: mapRestaurants = $searchStore.results
		.filter((item) => item.type === 'restaurant' && item.location)
		.map((item) => ({
			id: item.id,
			lat: item.location!.lat,
			lng: item.location!.lng,
			name: item.name,
			imageUrl: item.imageUrl,
			rating: item.rating,
			address: item.address
		}));
</script>

<svelte:head>
	<title>Search Results | Qpick</title>
	<meta name="description" content="Search results for restaurants and menu items on Qpick" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if !$searchStore.loading && $searchStore.results}
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold">{$searchStore.results.length} илэрц</h1>
			
			<!-- View Toggle -->
			<div class="flex rounded-lg bg-neutral-100 p-1 lg:hidden">
				<button
					class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
					{viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:text-neutral-800'}"
					on:click={() => viewMode = 'list'}
				>
					<List size={16} />
					List
				</button>
				<button
					class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
					{viewMode === 'map' ? 'bg-white text-primary shadow-sm' : 'text-neutral-600 hover:text-neutral-800'}"
					on:click={() => viewMode = 'map'}
				>
					<MapPin size={16} />
					Map
				</button>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- List View -->
		<div class="lg:block {viewMode === 'map' ? 'hidden lg:block' : ''}">
			<SearchFilterSort />

			<main class="mt-6">
				{#if $searchStore.loading}
					<div class="p-8 text-center">
						<div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-primary bg-primary/10">
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Loading search results...
						</div>
					</div>
				{:else if $searchStore.error}
					<div class="p-8 text-center">
						<div class="bg-error/10 border border-error/20 rounded-lg p-6">
							<div class="text-error text-lg font-medium mb-2">Search Error</div>
							<div class="text-error/80">{$searchStore.error}</div>
						</div>
					</div>
				{:else if !$searchStore.results || $searchStore.results.length === 0}
					<div class="p-8 text-center">
						<div class="bg-neutral-50 rounded-lg p-8">
							<div class="text-neutral-600 text-lg mb-2">No results found</div>
							<p class="text-neutral-500">No results found for "{currentQuery.query}". Please try a different search term.</p>
						</div>
					</div>
				{:else}
					<div class="animate-fadeInUp">
						<SearchResultsList results={$searchStore.results} />
					</div>
				{/if}
			</main>
		</div>

		<!-- Map View -->
		<div class="lg:block {viewMode === 'list' ? 'hidden lg:block' : ''}" style="height: 716px;">
			<div class="sticky top-24 h-full">
				<Map restaurants={mapRestaurants} />
			</div>
		</div>
	</div>
</div>
