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
	<title>Tomah</title>
	<meta name="description" content="Tomah is a restaurant ordering app" />
</svelte:head>

{#await data.restaurants}
    <MainPageLoader />
{:then restaurants}
    <div class="container mx-auto max-w-[1200px] justify-center flex flex-col gap-10 py-8">
        <RestaurantCarousel {restaurants} on:viewRestaurant={handleViewRestaurant} />
        <div class="animate-fadeInUp">
            <RestaurantMain {restaurants} />
        </div>
    </div>
{:catch error}
    <div class="container max-w-[1200px] justify-center flex flex-col gap-10 py-8">
        <p class="text-red-500 text-center">Error loading restaurants: {error.message}</p>
    </div>
{/await}