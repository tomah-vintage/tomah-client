<script lang="ts">
  import type { Restaurant } from '$lib/types/restaurant';
  import RestaurantCard from './RestaurantCard.svelte';
  
  export let restaurants: Restaurant[] = [];
  export let emptyMessage = 'No restaurants found';
</script>

<div class="restaurant-list">
  {#if restaurants.length === 0}
    <div class="empty-state">
      <p>{emptyMessage}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each restaurants as restaurant (restaurant.id)}
        <RestaurantCard {restaurant} />
      {/each}
    </div>
  {/if}
</div>
