<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCarouselCard from './RestaurantCarouselCard.svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ viewRestaurant: string }>();

	export let restaurants: Restaurant[] = [];
	export let itemsPerPage = 3;

	let currentIndex = 0;

	$: visibleRestaurants = restaurants.slice(currentIndex, currentIndex + itemsPerPage);

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
		dispatch('viewRestaurant', restaurantId);
	}
</script>

<div class="relative mx-auto w-full max-w-6xl">
	<div class="relative flex items-center">
		<button
			on:click={prev}
			class="focus:ring-primary-light absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:ring-2 focus:outline-none"
		>
			<ChevronLeft size={24} />
		</button>

		<div class="flex-1 overflow-hidden">
			<div
				class="flex space-x-4 pb-8 transition-transform duration-300 ease-in-out"
				style="transform: translateX(-{currentIndex * (100 / itemsPerPage)}%)"
			>
				{#each restaurants as restaurant (restaurant.id)}
					<div class="flex-shrink-0" style="width: calc(100% / {itemsPerPage});">
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
			class="focus:ring-primary-light absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:ring-2 focus:outline-none"
		>
			<ChevronRight size={24} />
		</button>
	</div>
</div>

<style lang="postcss">
	/* No specific styles needed here as width is set inline */
</style>
