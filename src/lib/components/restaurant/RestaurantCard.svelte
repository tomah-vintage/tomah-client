<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { createEventDispatcher } from 'svelte';
	import { Icon } from '$lib/components/common';
	import { Clock, MapPin } from 'lucide-svelte';
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
	class="restaurant-card flex cursor-pointer flex-col gap-1 rounded-2xl bg-white shadow-md"
	role="button"
	tabindex="0"
	aria-label={`View ${restaurant.name}`}
	on:click={activate}
	on:keydown={() => {}}
>
	<img src={restaurant.logo} alt={restaurant.name} class="h-32 w-full rounded-t-2xl object-cover" />
	<div class="flex flex-col gap-1 p-4">
		<h2 class="text-lg font-bold">{restaurant.name}</h2>
		<div class="ml-0.5 flex items-center gap-1">
			<Icon icon={Clock} width={16} height={16} />
			<p class="text-red-500">
				{restaurant.openingHours}
			</p>
		</div>
		<div class="flex items-center gap-1">
			<Icon icon={MapPin} width={16} height={16} />
			<p class="truncate text-gray-600">{restaurant.address}</p>
		</div>
	</div>
</div>
