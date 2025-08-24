<script lang="ts">
	import type { PageData } from './$types';
	import ImageGallery from '$lib/components/restaurant/ImageGallery.svelte';
	import FeaturedItems from '$lib/components/menu/FeaturedItems.svelte';
	import MenuTabs from '$lib/components/menu/MenuTabs.svelte';
	import MenuList from '$lib/components/menu/MenuList.svelte';
	import InfoPanel from '$lib/components/restaurant/InfoPanel.svelte';
	import Map from '$lib/components/restaurant/Map.svelte';
	import Reviews from '$lib/components/reviews/Reviews.svelte';

	export let data: PageData;

	let selectedCategoryId = data.categories[0]?.id || '';
	let searchTerm = '';

	$: filteredItems = data.menuItems.filter((menu) => menu.categories.includes(selectedCategoryId));
</script>

<div class="mt-3 w-full">
	<ImageGallery images={data.restaurant.restaurant_img_urls || []} />
	<FeaturedItems items={data.menuItems} />
	<MenuTabs categories={data.categories} bind:selectedCategoryId bind:searchTerm />
	<MenuList items={filteredItems} />
	<InfoPanel restaurant={data.restaurant} />
	<Map  />
	<Reviews reviews={data.restaurant.reviews} />
</div>
