<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { MapPin, Phone, Clock } from 'lucide-svelte';
	import { getRestaurantHoursDisplay, getRestaurantStatus } from '$lib/utils/restaurant';

	export let restaurant: Restaurant;

	$: hoursDisplay = getRestaurantHoursDisplay(restaurant);
	$: status = getRestaurantStatus(restaurant);
</script>

<div class="my-6 flex items-center gap-2 align-baseline">
	<img src={restaurant.logo} alt="logo" class="h-15 w-15 rounded-full object-cover" />
	<h1 class="text-3xl font-bold">{restaurant.name}</h1>
</div>

<p class="flex items-center gap-1.5 text-neutral-600"><Phone size={16} />{restaurant.address}</p>
<p class="flex items-center gap-1.5 text-neutral-600"><MapPin size={16} />{restaurant.address}</p>

<div class="flex items-center gap-1.5">
	<Clock size={16} />
	<div class="flex min-w-0 flex-1 items-center gap-2">
		<span class="truncate text-neutral-600">
			{hoursDisplay}
		</span>
		<span
			class="rounded-full px-2 py-0.5 text-xs font-semibold {status.isOpen
				? 'bg-green-100 text-green-700'
				: 'bg-red-100 text-red-700'}"
		>
			{status.text}
		</span>
	</div>
</div>
