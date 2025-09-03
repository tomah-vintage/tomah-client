<script lang="ts">
	import type { SearchResultItem } from '$lib/types/search';
	import { goto } from '$app/navigation';

	export let item: SearchResultItem;

	function navigateToItem() {
		if (item.type === 'restaurant') {
			goto(`/restaurant/${item.id}`);
		} else if (item.type === 'menuItem') {
			// Assuming menu items might link to a restaurant page or a specific menu item detail
			// For now, let's link to the restaurant if available, or just log
			console.log('Navigating to menu item:', item);
			// Example: goto(`/restaurant/${item.restaurantId}/menu/${item.id}`);
		}
	}
</script>

<div
	class="flex h-full cursor-pointer flex-col overflow-hidden rounded bg-white shadow-md transition-all duration-200 ease-in-out hover:-translate-y-1.5 hover:shadow-lg"
	on:click={navigateToItem}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') navigateToItem();
	}}
	role="button"
	tabindex="0"
>
	{#if item.imageUrl}
		<img
			src={item.imageUrl}
			alt={item.name}
			class="h-48 w-full border-b border-gray-200 object-cover"
		/>
	{/if}
	<div class="flex flex-grow flex-col p-4">
		<h3 class="mb-2 text-xl text-gray-900">{item.name}</h3>
		<p class="mb-2 text-sm text-gray-600 capitalize">
			{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
		</p>
		{#if item.description}
			<p class="line-clamp-3 overflow-hidden text-sm leading-normal text-gray-600">
				{item.description}
			</p>
		{/if}
	</div>
</div>

<style>
</style>
