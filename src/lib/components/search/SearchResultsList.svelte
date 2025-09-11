<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCard from '$lib/components/restaurant/RestaurantCard.svelte';

	export let results: SearchResultItem[] = [];

	function adaptToRestaurant(item: SearchResultItem): Restaurant {
		return {
			id: item.id,
			name: item.name,
			logo: item.imageUrl || '',
			address: item.address || '',
			openingHours: item.hours || '',
			rating: item.rating,
			restaurant_img_urls: item.restaurant_img_urls,
			lat: item.location?.lat,
			lng: item.location?.lng
		};
	}
</script>

<div class="search-results-list">
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
		{#each results as item (item.id)}
			<RestaurantCard restaurant={adaptToRestaurant(item)} variant="grid" />
		{/each}
	</div>
</div>
