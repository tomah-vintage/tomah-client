<script lang="ts">
  import type { PageData } from './$types';
  import { MenuMain } from '$lib/components/menu';
  import { order, addToOrder } from '$lib/stores/order';

  export let data: PageData;

  function handleAdd(event: CustomEvent) {
    addToOrder(event.detail);
  }
</script>

<svelte:head>
  <title>Menu | Tomah</title>
  <meta name="description" content="Restaurant Menu" />
</svelte:head>

<div class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2">
        <MenuMain items={data.menuItems} on:add={handleAdd} />
      </div>

      <div class="md:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Your Order</h2>
          {#if $order.items.length === 0}
            <p class="text-gray-500">Your order is empty.</p>
          {:else}
            <ul>
              {#each $order.items as item}
                <li class="flex justify-between items-center py-2 border-b">
                  <div>
                    <p class="font-semibold">{item.name}</p>
                    <p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <p>{item.quantity}</p>
                </li>
              {/each}
            </ul>
            <div class="flex justify-between items-center mt-4">
              <p class="text-lg font-bold">Total:</p>
              <p class="text-lg font-bold">${$order.total.toFixed(2)}</p>
            </div>
            <a href="/order" class="btn btn-primary w-full mt-4 bg-[#FF6B35] text-white">View Order</a>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>