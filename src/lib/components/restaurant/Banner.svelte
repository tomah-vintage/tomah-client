<script lang="ts">
	import { createRestaurantBannersQuery } from '$lib/stores/bannerQuery';
	import type { Banner } from '$lib/types/banner';

	export let restaurantId: number;

	$: bannersQuery = createRestaurantBannersQuery(restaurantId);
	$: ({ data, isLoading: loading, error } = $bannersQuery);
	$: allBanners = data?.results || data || [];
	$: banners = allBanners; // Show all banners for debugging

</script>

{#if loading}
	<div class="flex h-64 items-center justify-center bg-gray-200 rounded-lg">
		<div class="text-gray-500">Loading restaurant banners...</div>
	</div>
{:else if error}
	<div class="flex h-32 items-center justify-center bg-red-50 border border-red-200 rounded-lg">
		<div class="text-red-600">Error loading banners: {error.message}</div>
	</div>
{:else if allBanners.length === 0}
	<div class="flex h-32 items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg">
		<div class="text-yellow-600">No banners found for restaurant {restaurantId}</div>
	</div>
{:else if banners.length === 0}
	<div class="flex h-32 items-center justify-center bg-blue-50 border border-blue-200 rounded-lg">
		<div class="text-blue-600">Found {allBanners.length} banners, but none match criteria</div>
	</div>
{:else}
	<div class="space-y-4">
		{#each banners as banner}
			<div class="overflow-hidden rounded-lg">
				<img
					src={banner.image_url}
					alt="Restaurant Banner"
					class="h-64 w-full object-cover md:h-80 lg:h-96"
					style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
				/>
			</div>
		{/each}
	</div>
{/if}

