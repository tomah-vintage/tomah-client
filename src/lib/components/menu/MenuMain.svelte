<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import MenuList from './MenuList.svelte';

	export let items: MenuItem[] = [];
</script>

<div>
	<h1 class="mb-4 text-3xl font-bold">Menu</h1>
	<MenuList {items} on:add />
</div>
