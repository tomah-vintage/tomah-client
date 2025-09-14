<script lang="ts">
	import { restaurantStore } from '$lib/stores/restaurant';
	import RestaurantCard from '$lib/components/restaurant/RestaurantCard.svelte';

	$: likedRestaurants = $restaurantStore.restaurants.filter(r => r.is_liked);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-2xl font-bold mb-6">Миний хадгалсан</h1>

	{#if likedRestaurants.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{#each likedRestaurants as restaurant (restaurant.id)}
				<RestaurantCard {restaurant} variant="grid" />
			{/each}
		</div>
	{:else}
		<div class="text-center py-16">
			<p class="text-lg text-gray-500">Та хадгалсан ресторан байхгүй байна.</p>
		</div>
	{/if}
</div>