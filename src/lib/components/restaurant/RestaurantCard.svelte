<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { createEventDispatcher } from 'svelte';
	import { Clock, MapPin, Heart, Star } from 'lucide-svelte'; // Added Heart and Star
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher<{
		view: Restaurant;
	}>();

	export let restaurant: Restaurant;

	function activate() {
		dispatch('view', restaurant);
		goto(`/restaurant/${restaurant.id}`);
	}
</script>

<div
	class="restaurant-card relative mb-3 flex h-[248px] w-[300px] cursor-pointer flex-col rounded-3xl bg-white"
	style="box-shadow: 0 11px 3px 0 rgba(0, 0, 0, 0.00), 0 0 10.2px 0 rgba(0, 0, 0, 0.10);"
	role="button"
	tabindex="0"
	aria-label={`View ${restaurant.name}`}
	on:click={activate}
	on:keydown={() => {}}
>
	<img
		src={restaurant.logo}
		alt={restaurant.name}
		draggable="false"
		class="h-[152px] w-full rounded-t-2xl object-cover"
	/>

	<!-- Discount Badge -->
	{#if restaurant.discount}
		<div class="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-1 text-xs text-white">
			{restaurant.discount}%i
		</div>
	{/if}

	<!-- Heart Icon -->
	<div class="absolute top-2 right-2 rounded-full bg-white p-2 shadow-md">
		<Heart size={20} class="text-gray-500" />
	</div>

	<!-- Rating Badge -->
	{#if restaurant.rating}
		<div
			class="absolute top-[145px] right-4 flex items-center rounded-full bg-white px-3 py-1 shadow-md"
		>
			<Star size={16} class="mr-1 text-yellow-400" />
			<p class="text-sm font-semibold">{restaurant.rating}</p>
		</div>
	{/if}

	<div class="flex flex-col gap-1 py-3.5 pl-5">
		<h2 class="text-base font-bold">{restaurant.name}</h2>
		<div class="flex items-center gap-1">
			<Clock size={16} />
			<p class="text-sm text-red-500">
				{restaurant.openingHours}
			</p>
		</div>
		<div class="flex items-center gap-1">
			<MapPin size={16} />
			<p class="truncate text-sm text-gray-600">
				{restaurant.address}
			</p>
		</div>
	</div>
</div>
