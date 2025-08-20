<script lang="ts">
  import type { Restaurant } from '$lib/types/restaurant';
  import RestaurantCard from './RestaurantCard.svelte';

  export let restaurants: Restaurant[] = [];
  export let emptyMessage = 'No restaurants found.';
</script>

<div class="restaurant-list">
  {#if restaurants.length === 0}
    <p class="text-center text-gray-500">{emptyMessage}</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {#each restaurants as restaurant (restaurant.id)}
        <RestaurantCard {restaurant} />
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Add any specific styles here if needed */
</style>