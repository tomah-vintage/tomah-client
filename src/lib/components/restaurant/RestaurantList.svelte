<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCard from './RestaurantCard.svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let restaurants: Restaurant[] = [];
	export let emptyMessage = 'No restaurants found.';
	let currentIndex = 0;
	export let itemsPerPage = 4;

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
</script>

<div class="restaurant-list mb-10">
	{#if restaurants.length === 0}
		<p class="text-center text-gray-500">{emptyMessage}</p>
	{:else}
	<div class="flex justify-between mb-2">
		<p class="text-lg font-semibold self-center">Хөнглөлттэй бүтээгдэхүүн</p>
		<div class="flex gap-3 align-center">
			<button
				on:click={prev}
				class="focus:ring-primary-light rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
			>
				<ChevronLeft size={24} />
			</button>
			<button
				on:click={next}
				class="focus:ring-primary-light rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none"
			>
				<ChevronRight size={24} />
			</button>
		</div>
	</div>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-transform duration-300 ease-in-out">
			{#each restaurants as restaurant (restaurant.id)}
				<RestaurantCard {restaurant} />
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	/* Add any specific styles here if needed */
</style>
