<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import type { Restaurant } from '$lib/types/restaurant';
	import SearchResultCard from './SearchResultCard.svelte';
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
			restaurant_img_urls: item.imageUrl ? [item.imageUrl] : [],
			lat: item.location?.lat,
			lng: item.location?.lng
		};
	}
</script>

<div class="search-results-list">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each results as item (item.id)}
			{#if item.type === 'restaurant'}
				<RestaurantCard restaurant={adaptToRestaurant(item)} />
			{:else}
				<SearchResultCard {item} />
			{/if}
		{/each}
	</div>
</div>
