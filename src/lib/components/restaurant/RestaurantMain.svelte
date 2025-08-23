<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantList from './RestaurantList.svelte';

	export let restaurants: Restaurant[] = [];
	export let loading = false;
	export let error: string | null = null;
</script>

<div class="restaurant-main">
	<main>
		{#if loading}
			<div class="loading">Loading...</div>
		{:else if error}
			<div class="error">{error}</div>
		{:else}
			<RestaurantList {restaurants} />
		{/if}
	</main>
</div>
