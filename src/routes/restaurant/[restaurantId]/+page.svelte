<script lang="ts">
	import { page } from '$app/stores';
	import Banner from '$lib/components/restaurant/Banner.svelte';
	import FeaturedItems from '$lib/components/menu/FeaturedItems.svelte';
	import MenuTabs from '$lib/components/menu/MenuTabs.svelte';
	import MenuList from '$lib/components/menu/MenuList.svelte';
	import InfoPanel from '$lib/components/restaurant/InfoPanel.svelte';
	import OpeningHours from '$lib/components/restaurant/OpeningHours.svelte';
	import TableInfo from '$lib/components/restaurant/TableInfo.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
	import Reviews from '$lib/components/reviews/Reviews.svelte';
	import { createRestaurantQuery } from '$lib/stores/restaurantQuery';
	import { createMenuItemsQuery } from '$lib/stores/menuQuery';
	import RestaurantPageLoader from '$lib/components/loading/RestaurantPageLoader.svelte';
	import { ErrorPage } from '$lib/components/common';
	import type { PageData } from './$types';
	import { currentTable, qrOrigin } from '$lib/stores/table';

	export let data: PageData;

	$: restaurantId = data.restaurantId;

	// Handle table ID from QR code search parameters (server-side or client-side)
	$: tableId = data.tableId || $page.url.searchParams.get('table');

	// Reactive statement to handle table ID changes and QR origin
	$: {
		if (tableId && restaurantId) {
			// Set current table info
			currentTable.set({
				id: tableId,
				number: data.tableNumber ?? undefined,
				restaurantId: restaurantId
			});

			// Set QR origin for logo navigation (only when coming from QR with table)
			qrOrigin.set({
				restaurantId: restaurantId,
				tableId: tableId,
				timestamp: Date.now()
			});
		} else if (!tableId) {
			// Clear table if no table ID in URL (e.g., when navigating away)
			currentTable.clear();
			// Note: We don't clear QR origin here so logo can still navigate back
		}
	}

	// Use server-side loaded data as initial values, but still create reactive queries
	// for real-time updates and client-side navigation
	$: restaurantQuery = createRestaurantQuery(restaurantId);
	$: menuItemsQuery = createMenuItemsQuery(restaurantId);

	$: ({
		data: clientRestaurant,
		isLoading: restaurantLoading,
		error: restaurantError
	} = $restaurantQuery);
	$: ({ data: menuItemsResponse, isLoading: menuLoading, error: menuError } = $menuItemsQuery);

	// Use server-side data initially, then switch to client data when available
	$: restaurant = clientRestaurant || data.restaurant;
	$: menuItems = menuItemsResponse?.results || data.menuItems || [];

	$: featureFoods = menuItems.filter((item) => item.is_emphasized === true);

	let selectedCategoryId = '';
	let searchTerm = '';

	// Check if currently in table mode
	$: isTableMode = $currentTable !== null;

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

	// Generate SEO meta data
	$: pageTitle = restaurant ? `${restaurant.name} - Qpick` : 'Ресторан - Qpick';
	$: pageDescription = restaurant
		? `${restaurant.name} ресторанаас захиалга өгөөрэй. Хаяг: ${restaurant.address}. Tomah аппликешний тусламжтайгаар хүргэлт авцгаая.`
		: 'Ресторанаас захиалга өгөх - Tomah';
	$: pageImage = restaurant?.logo || restaurant?.restaurant_img_urls?.[0] || '/white-logo.png';
	$: canonicalUrl = `https://tomah.mn/restaurant/${restaurantId}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="restaurant" />
	<meta property="og:site_name" content="Qpick - Tomah" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={pageImage} />

	<!-- Restaurant-specific meta tags -->
	{#if restaurant}
		<meta
			property="place:location:latitude"
			content={restaurant.latitude || restaurant.lat?.toString() || ''}
		/>
		<meta
			property="place:location:longitude"
			content={restaurant.longitude || restaurant.lng?.toString() || ''}
		/>
		<meta property="restaurant:restaurant" content={restaurant.name} />
		<meta property="restaurant:contact_info:street_address" content={restaurant.address} />
	{/if}
</svelte:head>

{#if (restaurantLoading || menuLoading) && !restaurant}
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
		<TableInfo />

		{#if !isTableMode}
			<Banner {restaurantId} {restaurant} />
		{/if}

		<FeaturedItems items={featureFoods} {restaurantId} {restaurant} />
		<MenuTabs {restaurantId} bind:selectedCategoryId bind:searchTerm {isTableMode} />
		<MenuList items={filteredItems} {restaurantId} {restaurant} />

		<!-- Left-aligned smaller sections -->
		<div class="mt-8 space-y-6">
			{#if !isTableMode}
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
			{/if}

			<div class="max-w-4xl">
				<Reviews reviews={restaurant?.reviews || []} {restaurantId} />
			</div>
		</div>
	</div>
{/if}
