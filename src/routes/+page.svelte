<script lang="ts">
	import { RestaurantMain } from '$lib/components/restaurant';
	import { RestaurantCarousel } from '$lib/components/restaurant-carousel';
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
    {@const bannerHighlights = sortedHighlights.filter(h => h.highlight_type === 'BANNER')}
    {@const featuredHighlights = sortedHighlights.filter(h => h.highlight_type === 'FEATURED')}
    <div class="container mx-auto max-w-[1200px] justify-center flex flex-col gap-10 py-8">
        {#each bannerHighlights as banner}
            <RestaurantCarousel restaurants={banner.restaurants} on:viewRestaurant={handleViewRestaurant} />
        {/each}
        <div class="animate-fadeInUp">
            <RestaurantMain highlights={featuredHighlights} />
        </div>
    </div>
{:catch error}
    <div class="container max-w-[1200px] justify-center flex flex-col gap-10 py-8">
        <p class="text-red-500 text-center">Error loading data: {error.message}</p>
    </div>
{/await}