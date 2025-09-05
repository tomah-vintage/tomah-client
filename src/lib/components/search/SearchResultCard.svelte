<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import { goto } from '$app/navigation';
	import { Heart, Star, Clock, MapPin } from 'lucide-svelte';

	export let item: SearchResultItem;

	let isFavorited = false;

	function navigateToItem() {
		if (item.type === 'restaurant') {
			goto(`/restaurant/${item.id}`);
		} else if (item.type === 'menuItem' && item.restaurantId) {
			goto(`/restaurant/${item.restaurantId}`);
		}
	}

	function toggleFavorite(event: MouseEvent) {
		event.stopPropagation();
		isFavorited = !isFavorited;
		// Here you would typically call an action to save the favorite state
	}
</script>

<div
	class="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-lg"
	on:click={navigateToItem}
	on:keydown={(e) => {
		if (e.key === 'Enter') navigateToItem();
	}}
	role="button"
	tabindex="0"
>
	<div class="relative">
		{#if item.imageUrl}
			<img
				src={item.imageUrl}
				alt={item.name}
				class="h-48 w-full object-cover"
			/>
		{/if}
		<button
			on:click={toggleFavorite}
			class="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 transition-colors hover:bg-white"
			aria-label="Toggle favorite"
		>
			<Heart
				class="transition-all {isFavorited ? 'text-red-500 fill-current' : 'text-gray-700'}"
				size={20}
			/>
		</button>
	</div>

	<div class="flex flex-grow flex-col p-4">
		<div class="flex justify-between items-start">
			<h3 class="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
			{#if item.rating}
				<div class="flex items-center gap-1 bg-yellow-100 text-yellow-800 rounded-md px-2 py-0.5 text-sm">
					<Star size={14} class="fill-current" />
					<span class="font-bold">{item.rating.toFixed(1)}</span>
				</div>
			{/if}
		</div>

		{#if item.type === 'restaurant'}
			{#if item.hours}
				<div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
					<Clock size={14} />
					<span>{item.hours}</span>
				</div>
			{/if}
			{#if item.address}
				<div class="flex items-center gap-2 text-sm text-gray-600">
					<MapPin size={14} />
					<span class="truncate">{item.address}</span>
				</div>
			{/if}
		{/if}

		{#if item.type === 'menuItem'}
			{#if item.restaurantName}
				<p class="text-sm text-gray-600 mb-1">{item.restaurantName}</p>
			{/if}
			{#if item.price}
				<p class="text-base font-semibold text-gray-800">${item.price.toFixed(2)}</p>
			{/if}
		{/if}
	</div>
</div>