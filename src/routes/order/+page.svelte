<script lang="ts">
  import type { PageData } from './$types';
  import { order, removeFromOrder, updateQuantity } from '$lib/stores/order';

  export let data: PageData;

  function handleRemove(itemId: string) {
    removeFromOrder(itemId);
  }

  function handleUpdateQuantity(itemId: string, quantity: number) {
    updateQuantity(itemId, quantity);
  }
</script>

<svelte:head>
  <title>Your Order | Tomah</title>
  <meta name="description" content="Your current order" />
</svelte:head>

<div class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">Your Order</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        {#if $order.items.length === 0}
          <p class="text-gray-500">Your order is empty.</p>
        {:else}
          <ul>
            {#each $order.items as item}
              <li class="flex items-center justify-between py-4 border-b">
                <div class="flex items-center">
                  <img src={item.image} alt={item.name} class="w-20 h-20 object-cover rounded-lg mr-4" />
                  <div>
                    <p class="font-bold text-lg">{item.name}</p>
                    <p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    on:change={(e) => handleUpdateQuantity(item.id, e.currentTarget.valueAsNumber)}
                    class="input input-bordered w-20 mr-4 text-center"
                  />
                  <button class="btn btn-outline btn-error" on:click={() => handleRemove(item.id)}
                    >Remove</button
                  >
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="md:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
          <div class="flex justify-between items-center py-2 border-b">
            <p>Subtotal</p>
            <p>${$order.total.toFixed(2)}</p>
          </div>
          <div class="flex justify-between items-center py-2 border-b">
            <p>Tax</p>
            <p>$0.00</p>
          </div>
          <div class="flex justify-between items-center font-bold text-lg mt-4">
            <p>Total</p>
            <p>${$order.total.toFixed(2)}</p>
          </div>
          <button class="btn btn-primary w-full mt-6 bg-[#FF6B35] text-white">Checkout</button>
        </div>
      </div>
    </div>
  </div>
</div>
