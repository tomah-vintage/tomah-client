<script lang="ts">
  import type { Restaurant } from '$lib/types/restaurant';
  import { goto } from '$app/navigation';

  export let restaurant: Restaurant;

  function handleClick() {
    goto(`/restaurant/${restaurant.id}`);
  }
</script>

<a
  href="/menu/{restaurant.id}"
  class="restaurant-carousel-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105 block"
  on:click|preventDefault={handleClick}
>
  <img
    src={restaurant.imageUrl}
    alt={restaurant.name}
    class="w-full h-60 object-cover"
  />
  <!-- <div class="p-4">
    <h3 class="font-semibold text-lg text-gray-800 truncate">
      {restaurant.name}
    </h3>
    <p class="text-sm text-gray-600 truncate">{restaurant.address}</p>
  </div> -->
</a>

<style lang="postcss">
  .restaurant-carousel-card {
    /* Add any specific styles here if needed */
  }
</style>
