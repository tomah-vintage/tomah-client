<script lang="ts">
	import { page } from '$app/stores';
	import Banner from '$lib/components/restaurant/Banner.svelte';
	import FeaturedItems from '$lib/components/menu/FeaturedItems.svelte';
	import MenuTabs from '$lib/components/menu/MenuTabs.svelte';
	import MenuList from '$lib/components/menu/MenuList.svelte';
	import InfoPanel from '$lib/components/restaurant/InfoPanel.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
	import Reviews from '$lib/components/reviews/Reviews.svelte';
	import { createRestaurantQuery } from '$lib/stores/restaurantQuery';
	import { createMenuItemsQuery } from '$lib/stores/menuQuery';
	import RestaurantPageLoader from '$lib/components/loading/RestaurantPageLoader.svelte';

	$: restaurantId = parseInt($page.params.restaurantId || '0', 10);
	
	$: restaurantQuery = createRestaurantQuery(restaurantId);
	$: menuItemsQuery = createMenuItemsQuery(restaurantId);
	
	$: ({ data: restaurant, isLoading: restaurantLoading, error: restaurantError } = $restaurantQuery);
	$: ({ data: menuItemsResponse, isLoading: menuLoading, error: menuError } = $menuItemsQuery);
	$: menuItems = menuItemsResponse?.results || [];

	$: featureFoods = menuItems.slice(0,4)
	
	let selectedCategoryId = '';
	let searchTerm = '';

	$: filteredItems = Array.isArray(menuItems)
		? menuItems.filter((menu) => {
			const matchesCategory = !selectedCategoryId || menu.categories.includes(selectedCategoryId);
			const matchesSearch = !searchTerm || menu.name.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesCategory && matchesSearch;
		})
		: [];
</script>

{#if restaurantLoading || menuLoading}
	<RestaurantPageLoader />
{:else if restaurantError || menuError}
	<div class="mt-3 w-full p-8 text-center">
		<div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
			<div class="text-red-600 text-lg font-medium mb-2">Failed to load restaurant</div>
			<div class="text-red-500 mb-4">
				{restaurantError?.message || menuError?.message || 'Unknown error'}
			</div>
			<div class="text-gray-600">Please try again later.</div>
		</div>
	</div>
{:else if restaurant}
	<div class="container mx-auto max-w-[1200px] mt-3 w-full px-4">
		<Banner {restaurantId} />
		<FeaturedItems items={featureFoods} {restaurantId} />
		<MenuTabs {restaurantId} bind:selectedCategoryId bind:searchTerm />
		<MenuList items={filteredItems} {restaurantId} />

		<!-- Left-aligned smaller sections -->
		<div class="mt-8 space-y-6">
			<div class="max-w-2xl">
				<InfoPanel {restaurant} />
			</div>
			
			<div class="max-w-2xl">
				<h3 class="mb-4 text-xl font-bold text-gray-900">Байршил</h3>
				<Map locations={restaurant.latitude && restaurant.longitude ? [{latitude: restaurant.latitude, longitude: restaurant.longitude, name: restaurant.name}] : []} />
			</div>

			<div class="max-w-4xl">
				<Reviews reviews={restaurant?.reviews || []} {restaurantId} />
			</div>
		</div>
	</div>
{/if}
