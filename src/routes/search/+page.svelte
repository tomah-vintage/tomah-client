<script lang="ts">
	import SearchResultsList from '$lib/components/search/SearchResultsList.svelte';
	import SearchFilterSort from '$lib/components/search/SearchFilterSort.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
		import { createSearchQuery } from '$lib/stores/searchQuery';
 	import { page } from '$app/stores';
 	import { goto } from '$app/navigation';
 	import { parseSearchUrl, constructSearchUrl } from '$lib/utils/search';
 	import { List, MapPin } from 'lucide-svelte';
 	import SearchPageLoader from '$lib/components/loading/SearchPageLoader.svelte';
	import type { SearchQuery } from '$lib/types/search';

	let viewMode: 'list' | 'map' = 'list';

	$: currentQuery = parseSearchUrl($page.url);
	$: searchQuery = createSearchQuery(currentQuery);
	$: ({ data: searchResponse, isLoading, error } = $searchQuery);
	$: results = searchResponse?.results || [];

		console.log("mapRestaurants", results);
		

	function handleFilterChange(event: CustomEvent<Partial<SearchQuery>>) {
		const newQuery = { ...currentQuery, ...event.detail };
		const newUrl = constructSearchUrl(newQuery, $page.url.pathname);
		goto(newUrl, { keepFocus: true, noScroll: true });
	}
</script>

<svelte:head>
	<title>Search Results | Qpick</title>
	<meta name="description" content="Search results for restaurants and menu items on Qpick" />
</svelte:head>

{#if isLoading}
	<SearchPageLoader />
{:else if error}
	<div class="container mx-auto px-4 py-8">
		<div class="py-8 text-center">
			<div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
				<div class="text-red-600 text-lg font-medium mb-2">Search Error</div>
				<div class="text-red-500 mb-4">Error: {error.message || 'Failed to search'}</div>
				<div class="text-gray-600">Please try again later.</div>
			</div>
		</div>
	</div>
{:else if results}
	<div class="container mx-auto px-4 py-8">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold">{results.length} илэрц</h1>
			
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

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- List View -->
			<div class="lg:block {viewMode === 'map' ? 'hidden lg:block' : ''}">
				<SearchFilterSort on:change={handleFilterChange} />

				<main class="mt-6">
					{#if !results || results.length === 0}
						<div class="p-8 text-center">
							<div class="bg-gray-50 rounded-lg p-8">
								<div class="text-gray-600 text-lg mb-2">No results found</div>
								<p class="text-gray-500">No results found for "{currentQuery.query}". Please try a different search term.</p>
							</div>
						</div>
					{:else}
						<div class="animate-fadeInUp">
							<SearchResultsList {results} />
						</div>
					{/if}
				</main>
			</div>

			<!-- Map View -->
			<div class="lg:block {viewMode === 'list' ? 'hidden lg:block' : ''}" style="height: 716px;">
				<div class="sticky top-24 h-full">
					<Map/>
				</div>
			</div>
		</div>
	</div>
{/if}
