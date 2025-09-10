<script lang="ts">
	import type { PageData } from './$types';
	import Banner from '$lib/components/restaurant/Banner.svelte';
	import FeaturedItems from '$lib/components/menu/FeaturedItems.svelte';
	import MenuTabs from '$lib/components/menu/MenuTabs.svelte';
	import MenuList from '$lib/components/menu/MenuList.svelte';
	import InfoPanel from '$lib/components/restaurant/InfoPanel.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
	import Reviews from '$lib/components/reviews/Reviews.svelte';

	export let data: PageData;

	// Ensure data is available and has the expected structure
	$: menuItems = data.menuItems || [];
	$: restaurantId = parseInt(data.restaurant.id, 10);
	
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

<div class="mt-3 w-full">
	<Banner {restaurantId} />
	<FeaturedItems items={menuItems} {restaurantId} />
	<MenuTabs {restaurantId} bind:selectedCategoryId bind:searchTerm />
	<MenuList items={filteredItems} {restaurantId} />
	
	<!-- Left-aligned smaller sections -->
	<div class="mt-8 space-y-6">
		<div class="max-w-2xl">
			<InfoPanel restaurant={data.restaurant} />
		</div>
		
		<div class="max-w-2xl">
			<h3 class="mb-4 text-xl font-bold text-gray-900">Байршил</h3>
			<Map />
		</div>
		
		<div class="max-w-4xl">
			<Reviews reviews={data.restaurant?.reviews || []} {restaurantId} />
		</div>
	</div>
</div>
