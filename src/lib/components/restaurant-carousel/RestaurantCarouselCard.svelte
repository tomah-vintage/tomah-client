<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { goto } from '$app/navigation';

	export let restaurant: Restaurant;

	function handleClick() {
		goto(`/restaurant/${restaurant.id}`);
	}
</script>

<a
	href="/menu/{restaurant.id}"
	class="restaurant-carousel-card block transform cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-200 hover:scale-105"
	on:click|preventDefault={handleClick}
>
	<img src={restaurant.logo} alt={restaurant.name} class="h-60 w-full object-cover" />
	<!-- <div class="p-4">
    <h3 class="font-semibold text-lg text-gray-800 truncate">
      {restaurant.name}
    </h3>
    <p class="text-sm text-gray-600 truncate">{restaurant.address}</p>
  </div> -->
</a>

<style lang="postcss">
	.restaurant-carousel-card {
		/* Add any specific styles here if needed */
	}
</style>
