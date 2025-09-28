<script lang="ts">
	import { page } from '$app/stores';
	import Banner from '$lib/components/restaurant/Banner.svelte';
	import FeaturedItems from '$lib/components/menu/FeaturedItems.svelte';
	import MenuTabs from '$lib/components/menu/MenuTabs.svelte';
	import MenuList from '$lib/components/menu/MenuList.svelte';
	import InfoPanel from '$lib/components/restaurant/InfoPanel.svelte';
	import OpeningHours from '$lib/components/restaurant/OpeningHours.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
	import Reviews from '$lib/components/reviews/Reviews.svelte';
	import { createRestaurantQuery } from '$lib/stores/restaurantQuery';
	import { createMenuItemsQuery } from '$lib/stores/menuQuery';
	import RestaurantPageLoader from '$lib/components/loading/RestaurantPageLoader.svelte';
	import { ErrorPage } from '$lib/components/common';

	$: restaurantId = parseInt($page.params.restaurantId || '0', 10);

	$: restaurantQuery = createRestaurantQuery(restaurantId);
	$: menuItemsQuery = createMenuItemsQuery(restaurantId);

	$: ({
		data: restaurant,
		isLoading: restaurantLoading,
		error: restaurantError
	} = $restaurantQuery);
	$: ({ data: menuItemsResponse, isLoading: menuLoading, error: menuError } = $menuItemsQuery);
	$: menuItems = menuItemsResponse?.results || [];

	$: featureFoods = menuItems.slice(0, 4);

	let selectedCategoryId = '';
	let searchTerm = '';

	$: filteredItems = Array.isArray(menuItems)
		? menuItems.filter((menu) => {
				const matchesCategory = !selectedCategoryId || menu.categories.includes(selectedCategoryId);
				const matchesSearch =
					!searchTerm || menu.name.toLowerCase().includes(searchTerm.toLowerCase());
				return matchesCategory && matchesSearch;
			})
		: [];

	function getRestaurantLocation(restaurant: any) {
		if (!restaurant) return [];

		// Check for latitude/longitude (string format)
		const lat = restaurant.latitude || restaurant.lat?.toString();
		const lng = restaurant.longitude || restaurant.lng?.toString();

		if (lat && lng && lat !== '0' && lng !== '0') {
			return [
				{
					latitude: lat,
					longitude: lng,
					name: restaurant.name
				}
			];
		}

		return [];
	}
</script>

{#if restaurantLoading || menuLoading}
	<RestaurantPageLoader />
{:else if restaurantError || menuError}
	<ErrorPage
		title="Ресторан ачаалж чадсангүй"
		message={restaurantError?.message ||
			menuError?.message ||
			'Тодорхойгүй алдаа гарлаа. Дахин оролдоно уу.'}
		statusCode={500}
	/>
{:else if restaurant}
	<div class="container mx-auto mt-3 w-full max-w-[1200px]">
		<Banner {restaurantId} />
		<FeaturedItems items={featureFoods} {restaurantId} {restaurant} />
		<MenuTabs {restaurantId} bind:selectedCategoryId bind:searchTerm />
		<MenuList items={filteredItems} {restaurantId} {restaurant} />

		<!-- Left-aligned smaller sections -->
		<div class="mt-8 space-y-6">
			<div class="max-w-2xl">
				<InfoPanel {restaurant} />
			</div>

			<div class="max-w-2xl">
				<OpeningHours {restaurant} />
			</div>

			<div class="max-w-2xl">
				<h3 class="mb-4 text-xl font-bold text-gray-900">Байршил</h3>
				<Map locations={getRestaurantLocation(restaurant)} />
			</div>

			<div class="max-w-4xl">
				<Reviews reviews={restaurant?.reviews || []} {restaurantId} />
			</div>
		</div>
	</div>
{/if}
