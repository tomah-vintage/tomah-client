<script lang="ts">
  import type { MenuItem } from '$lib/types/menu';
  import MenuCard from './MenuCard.svelte';

  export let items: MenuItem[] = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each items as item (item.id)}
    <MenuCard {item} on:add />
  {/each}
</div>
