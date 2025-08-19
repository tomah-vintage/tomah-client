<script lang="ts">
  import type { PageData } from './$types';
  import { RestaurantMain } from '$lib/components/restaurant';
  import { restaurantStore, restaurantActions } from '$lib/stores/restaurant';
  
  export let data: PageData;

  restaurantStore.update(state => ({...state, restaurants: data.restaurants, error: data.error}))
</script>

<svelte:head>
  <title>Tomah</title>
  <meta name="description" content="Tomah is a restaurant ordering app" />
</svelte:head>

<RestaurantMain 
  restaurants={$restaurantStore.restaurants}
  loading={$restaurantStore.loading}
  error={$restaurantStore.error}
/>