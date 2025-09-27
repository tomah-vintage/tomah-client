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

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<button 
			on:click={() => goto('/orders')}
			class="flex items-center text-gray-600 hover:text-gray-800"
		>
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Буцах
		</button>
	</div>

	{#if orderId}
		<OrderStatus {orderId} />
	{:else}
		<div class="text-center py-8">
			<p class="text-gray-600">Захиалгын мэдээлэл ачааллаж байна...</p>
		</div>
	{/if}
</div>