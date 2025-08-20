<script lang="ts">
  import type { PageData } from './$types';
  import { RestaurantMain } from '$lib/components/restaurant';
  import { RestaurantCarousel } from '$lib/components/restaurant-carousel';
  import { restaurantStore, restaurantActions } from '$lib/stores/restaurant';
  import { goto } from '$app/navigation';
  
  export let data: PageData;

  restaurantStore.update(state => ({...state, restaurants: data.restaurants, error: data.error}))

  function handleViewRestaurant(event: CustomEvent<string>) {
    goto(`/restaurant/${event.detail}`);
  }


</script>

<svelte:head>
  <title>Tomah</title>
  <meta name="description" content="Tomah is a restaurant ordering app" />
</svelte:head>


<RestaurantCarousel
  restaurants={$restaurantStore.restaurants}
  on:viewRestaurant={handleViewRestaurant}
/>

<RestaurantMain 
  restaurants={$restaurantStore.restaurants}
  loading={$restaurantStore.loading}
  error={$restaurantStore.error}
/>