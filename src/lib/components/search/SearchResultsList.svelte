<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCard from '$lib/components/restaurant/RestaurantCard.svelte';

	export let results: SearchResultItem[] = [];

	function adaptToRestaurant(item: SearchResultItem): Restaurant {
		// Handle the direct mapping from search API which returns restaurant objects directly
		if ('logo' in item && 'open_hours' in item) {
			// Direct restaurant object from search API
			return {
				id: item.id,
				name: item.name,
				logo: (item as any).logo || '',
				address: item.address || '',
				openingHours: item.hours || '',
				open_hours: (item as any).open_hours,
				rating: item.average_rating,
				average_rating: item.average_rating,
				restaurant_img_urls: item.restaurant_img_urls || [],
				latitude: item.latitude,
				longitude: item.longitude,
				lat: parseFloat(item.latitude),
				lng: parseFloat(item.longitude),
				is_liked: item?.isLiked || false
			};
		}
		
		// Fallback for other search result formats
		return {
			id: item.id,
			name: item.name,
			logo: item.imageUrl || '',
			address: item.address || '',
			openingHours: item.hours || '',
			open_hours: item.open_hours,
			rating: item.average_rating,
			restaurant_img_urls: item.restaurant_img_urls || [],
			lat: parseFloat(item.latitude),
			lng: parseFloat(item.longitude),
			is_liked: item?.isLiked || false
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
