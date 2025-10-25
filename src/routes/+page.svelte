<script lang="ts">
	import { RestaurantMain } from '$lib/components/restaurant';
	import { RestaurantCarousel } from '$lib/components/restaurant-carousel';
	import PlatformBanner from '$lib/components/banner/PlatformBanner.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import MainPageLoader from '$lib/components/loading/MainPageLoader.svelte';

	export let data: PageData;

	function handleViewRestaurant(event: CustomEvent<string>) {
		goto(`/restaurant/${event.detail}`);
	}
</script>

<svelte:head>
	<title>Qpick</title>
	<meta name="description" content="Tomah is a restaurant ordering app" />
</svelte:head>

{#await data.highlights}
	<MainPageLoader />
{:then highlights}
	{@const sortedHighlights = highlights.sort((a, b) => a.order_index - b.order_index)}
	{@const featuredHighlights = sortedHighlights.filter(
		(h) => h.highlight_type === 'FEATURED' || h.highlight_type === 'BADGE'
	)}
	<div class="container mx-auto flex max-w-[1200px] flex-col justify-center gap-10">
		<PlatformBanner />
		<div class="animate-fadeInUp">
			<RestaurantMain highlights={featuredHighlights} />
		</div>
	</div>
{:catch error}
	<div class="container flex max-w-[1200px] flex-col justify-center gap-10 py-8">
		<p class="text-center text-red-500">Error loading data: {error.message}</p>
	</div>
{/await}
