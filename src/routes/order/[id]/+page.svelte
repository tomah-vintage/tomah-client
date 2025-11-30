<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import OrderStatus from '$lib/components/order/OrderStatus.svelte';
	import { onMount } from 'svelte';

	let orderId: number;

	onMount(() => {
		// Check if user is authenticated
		if (!$authStore.isAuthenticated) {
			goto('/');
			return;
		}

		// Get order ID from URL params
		const id = $page.params.id;
		if (!id || isNaN(parseInt(id))) {
			goto('/');
			return;
		}

		orderId = parseInt(id);
	});
</script>

<svelte:head>
	<title>Захиалгын мэдээлэл - Tomah</title>
</svelte:head>

<div class="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
	<button
		on:click={() => goto('/orders')}
		class="mb-4 inline-flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-900"
	>
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
		<span class="font-medium">Буцах</span>
	</button>

	{#if orderId}
		<OrderStatus {orderId} />
	{:else}
		<div class="py-8 text-center">
			<p class="text-gray-600">Захиалгын мэдээлэл ачааллаж байна...</p>
		</div>
	{/if}
</div>
