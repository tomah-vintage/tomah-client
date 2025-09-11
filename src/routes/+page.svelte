<script lang="ts">
	import { RestaurantMain } from '$lib/components/restaurant';
	import { RestaurantCarousel } from '$lib/components/restaurant-carousel';
	import MainPageBanner from '$lib/components/banner/MainPageBanner.svelte';
	import { goto } from '$app/navigation';
	import { createRestaurantsQuery } from '$lib/stores/restaurantQuery';
	import MainPageLoader from '$lib/components/loading/MainPageLoader.svelte';

	const restaurantsQuery = createRestaurantsQuery();
	
	$: ({ data: restaurantsResponse, isLoading: loading, error } = $restaurantsQuery);
	$: restaurants = restaurantsResponse?.results || [];

	function handleViewRestaurant(event: CustomEvent<string>) {
		goto(`/restaurant/${event.detail}`);
	}
</script>

<svelte:head>
	<title>Tomah</title>
	<meta name="description" content="Tomah is a restaurant ordering app" />
</svelte:head>

{#if loading}
	<MainPageLoader />
{:else if error}
	<div class="container mx-auto px-4 py-8">
		<div class="py-8 text-center">
			<div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
				<div class="text-red-600 text-lg font-medium mb-2">Something went wrong</div>
				<div class="text-red-500 mb-4">Error: {error.message || 'Failed to load restaurants'}</div>
				<div class="text-gray-600">Please try again later.</div>
			</div>
		</div>
	</div>
{:else}
	<div class="container mx-auto flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8">
		<MainPageBanner />
		<div class="animate-fadeInUp">
			<RestaurantCarousel {restaurants} on:viewRestaurant={handleViewRestaurant} />
			<RestaurantMain {restaurants} />
		</div>
	</div>
{/if}
