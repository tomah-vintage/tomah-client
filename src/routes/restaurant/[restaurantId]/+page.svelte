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

	let selectedCategoryId = data.restaurant.menu.categories[0].id;
	let searchTerm = '';

	$: filteredItems = data.restaurant.menu.items.filter(
		(item) =>
			item.categoryId === selectedCategoryId &&
			item.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>

<div>
	<ImageGallery images={data.restaurant.restaurant_img_urls} />
	<h1>{data.restaurant.name}</h1>
	<InfoPanel restaurant={data.restaurant} />
	<Map lat={data.restaurant.lat} lng={data.restaurant.lng} />
	<img src={data.restaurant.logo} alt="logo" />
	<FeaturedItems items={data.restaurant.featuredItems} />
	<MenuTabs categories={data.restaurant.menu.categories} bind:selectedCategoryId bind:searchTerm />
	<MenuList items={filteredItems} />
	<Reviews reviews={data.restaurant.reviews} />
</div>
