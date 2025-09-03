<script lang="ts">
	import type { PageData } from './$types';
	import { SearchMain } from '$lib/components/search';
	import { searchStore, searchActions } from '$lib/stores/search';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { parseSearchUrl } from '$lib/utils/search';

	export let data: PageData;

	$: currentQuery = parseSearchUrl($page.url);

	onMount(() => {
		// Trigger search when the page loads or URL changes
		searchActions.performSearch(currentQuery);
	});

	// React to URL changes (e.g., back/forward navigation, or manual URL edit)
	$: if ($page.url.searchParams.get('q') !== $searchStore.currentQuery.query) {
		searchActions.performSearch(currentQuery);
	}
</script>

<svelte:head>
	<title>Search Results | Qpick</title>
	<meta name="description" content="Search results for restaurants and menu items on Qpick" />
</svelte:head>

<SearchMain
	results={$searchStore.results}
	loading={$searchStore.loading}
	error={$searchStore.error}
	{currentQuery}
/>
