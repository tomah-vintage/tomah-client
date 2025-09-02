<script lang="ts">
	import { RestaurantMain } from '$lib/components/restaurant';
	import { RestaurantCarousel } from '$lib/components/restaurant-carousel';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { restaurantStore, restaurantActions } from '$lib/stores/restaurant';
	import type { Restaurant } from '$lib/types/restaurant';
	import { SkeletonLoader } from '$lib/components/common';

	let restaurants: Restaurant[] = [];
	let loading = false;
	let error: string | null = null;

	onMount(() => {
		restaurantActions.loadRestaurants();
	});

	$: loading = $restaurantStore.loading;
	$: error = $restaurantStore.error ?? null;
	$: restaurants = $restaurantStore.restaurants ?? [];

	function handleViewRestaurant(event: CustomEvent<string>) {
		goto(`/restaurant/${event.detail}`);
	}
</script>

<svelte:head>
	<title>Tomah</title>
	<meta name="description" content="Tomah is a restaurant ordering app" />
</svelte:head>

<div class="container mx-auto flex flex-col gap-10 py-8">
	{#if loading}
		<SkeletonLoader type="carousel" />
		<SkeletonLoader type="list" />
	{:else if error}
		<div class="py-8 text-center text-red-500">
			<p>Error: {error}</p>
			<p>Please try again later.</p>
		</div>
	{:else}
		<RestaurantCarousel {restaurants} on:viewRestaurant={handleViewRestaurant} />
		<RestaurantMain {restaurants} />
	{/if}
</div>
