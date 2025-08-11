<script lang="ts">
  import type { MenuItem } from '$lib/types/menu';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    add: MenuItem;
  }>();

  export let item: MenuItem;
</script>

<div class="card bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
  <figure class="h-48 overflow-hidden">
    <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
  </figure>
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-800">{item.name}</h2>
    <p class="text-gray-600 mt-2">{item.description}</p>
    <div class="flex justify-between items-center mt-4">
      <p class="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
      <button class="btn btn-primary bg-[#FF6B35] text-white" on:click={() => dispatch('add', item)}>Add to Cart</button>
    </div>
  </div>
</div>
