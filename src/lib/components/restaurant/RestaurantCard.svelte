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
  class="restaurant-card bg-white rounded-2xl shadow-md flex flex-col gap-1 cursor-pointer"
  role="button"
  tabindex="0"
  aria-label={`View ${restaurant.name}`}
  on:click={activate}
  on:keydown={()=>{}}
>
  <img src={restaurant.imageUrl} alt={restaurant.name} class="w-full h-32 object-cover rounded-t-2xl" />
  <div class="p-4 flex flex-col gap-1">
    <h2 class="text-lg font-bold">{restaurant.name}</h2>
    <div class="flex items-center gap-1 ml-0.5">
      <Icon icon={Clock} width={16} height={16} />
      <p class="text-red-500">
        {restaurant.openingHours}
      </p>
    </div>
    <div class="flex items-center gap-1">
      <Icon icon={MapPin} width={16} height={16} />
      <p class="text-gray-600 truncate">{restaurant.address}</p>
    </div>
   
  </div>
</div>
