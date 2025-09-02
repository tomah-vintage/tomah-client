<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantList from './RestaurantList.svelte';

	export let restaurants: Restaurant[] = [];
</script>

<div class="flex flex-col gap-4.5">
	<RestaurantList {restaurants} />
	<RestaurantList {restaurants} />
	<RestaurantList {restaurants} />
	<RestaurantList {restaurants} />
</div>
