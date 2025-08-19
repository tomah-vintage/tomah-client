<script lang="ts">
  import type { Restaurant } from '$lib/types/restaurant';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    view: Restaurant;
  }>();
  
  export let restaurant: Restaurant;
</script>

<div class="restaurant-card" on:click={() => dispatch('view', restaurant)}>
  <img src={restaurant.imageUrl} alt={restaurant.name} class="w-full h-32 object-cover"/>
  <div class="p-4">
    <h2 class="text-lg font-bold">{restaurant.name}</h2>
    <p class="text-gray-600">{restaurant.address}</p>
    <p class="text-gray-600">{restaurant.openingHours}</p>
  </div>
</div>
