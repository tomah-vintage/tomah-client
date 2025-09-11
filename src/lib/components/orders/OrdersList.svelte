<script lang="ts">
	import type { Order } from '$lib/types/order';
	import OrderCard from './OrderCard.svelte';

	export let orders: Order[];
</script>

<div class="space-y-4">
	{#each orders as order}
		<OrderCard {order} />
	{/each}
</div>