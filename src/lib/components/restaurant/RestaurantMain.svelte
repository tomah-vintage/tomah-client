<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantList from './RestaurantList.svelte';
	import Icon from '../common/Icon.svelte';
	import { Loader } from 'lucide-svelte';


	export let restaurants: Restaurant[] = [];
	export let loading = false;
	export let error: string | null = null;
</script>

<div class="restaurant-main">
	<main>
		{#if loading}
			<div class="mt-20 flex w-full justify-center gap-2">
				<Icon icon={Loader} size={60} color="#DC2625" />
				<p class="self-center text-5xl">Loading...</p>
			</div>
		{:else if error}
			<div class="error">{error}</div>
		{:else}
			<RestaurantList {restaurants} />
			<RestaurantList {restaurants} />
			<RestaurantList {restaurants} />
			<RestaurantList {restaurants} />
		{/if}
	</main>
</div>
