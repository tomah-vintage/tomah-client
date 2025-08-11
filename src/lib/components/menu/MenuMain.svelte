<script lang="ts">
  import type { MenuItem } from '$lib/types/menu';
  import MenuList from './MenuList.svelte';

  export let items: MenuItem[] = [];
</script>

<div>
  <h1 class="text-3xl font-bold mb-4">Menu</h1>
  <MenuList {items} on:add />
</div>
