<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import type { Restaurant } from '$lib/types/restaurant';
	import MenuList from './MenuList.svelte';

	export let items: MenuItem[] = [];
	export let restaurantId: number;
	export let restaurant: Restaurant | null = null;
</script>

<div>
	<h1 class="mb-4 text-3xl font-bold">Menu</h1>
	<MenuList {items} {restaurantId} {restaurant} on:add />
</div>
