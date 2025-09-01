<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCarouselCard from './RestaurantCarouselCard.svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { restaurantStore } from '$lib/stores/restaurant';

	const dispatch = createEventDispatcher<{ viewRestaurant: string }>();

	export let restaurants: Restaurant[] = [];
	export let itemsPerPage = 3;
	export let loading = false;

	let currentIndex = 0;

	// $: visibleRestaurants = restaurants?.slice(currentIndex, currentIndex + itemsPerPage);
	$: loading = $restaurantStore.loading;

	function next() {
		if (currentIndex + itemsPerPage < restaurants.length) {
			currentIndex += 1;
		} else {
			currentIndex = 0; // Loop back to start
		}
	}

	function prev() {
		if (currentIndex > 0) {
			currentIndex -= 1;
		} else {
			currentIndex = restaurants.length - itemsPerPage; // Loop to end
		}
	}

	function handleCardView(restaurantId: string) {
console.log("restaurantId", restaurantId)
		dispatch('viewRestaurant', restaurantId);
	}
</script>

<div class="relative w-full">
	{#if loading}
	<div>
	</div>
	{:else}
	<div class="relative flex items-center">
		<button
			on:click={prev}
			class="focus:ring-primary-light absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
		>
			<ChevronLeft size={24} />
		</button>

		<div class="flex-1 overflow-hidden">
			<div
				class="flex space-x-4 pb-8 transition-transform duration-300 ease-in-out"
				style="transform: translateX(-{currentIndex * (100 / itemsPerPage)}%)"
			>
				{#each restaurants as restaurant (restaurant.id)}
					<div class="flex-shrink-0 overflow-hidden rounded-lg w-full" style="width: calc(100% / {itemsPerPage} - 4%);">
						<RestaurantCarouselCard
							{restaurant}
							on:view={(event) => handleCardView(event.detail)}
						/>
					</div>
				{/each}
			</div>
		</div>

		<button
			on:click={next}
			class="focus:ring-primary-light absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
		>
			<ChevronRight size={24} />
		</button>
	</div>
	{/if}
</div>

<style lang="postcss">
	/* No specific styles needed here as width is set inline */
</style>
