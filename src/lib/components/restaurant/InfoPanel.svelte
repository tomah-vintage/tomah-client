<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { MapPin, Phone, Clock } from 'lucide-svelte';

	export let restaurant: Restaurant;
</script>

<div class="my-6 flex items-center gap-2 align-baseline">
	<img src={restaurant.logo} alt="logo" class="h-15 w-15 rounded-full object-cover" />
	<h1 class="text-3xl font-bold">{restaurant.name}</h1>
</div>

<p class="text-gray-500 flex items-center gap-1"><MapPin size={16}/>{restaurant.address}</p>
<p class="text-gray-500 flex items-center gap-1"> <Phone size={16}/>{restaurant.address}</p>
<p class="text-gray-500 flex items-center gap-1"><Clock size={16}/>{restaurant.address}</p>
