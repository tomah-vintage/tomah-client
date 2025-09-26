<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { ORDER_STATUS_LABELS } from '$lib/utils/order';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';

	interface OrderItem {
		menu_item: {
			id: number;
			name: string;
			price: string;
			img_urls: string[];
		};
		quantity: number;
		unit_price: string;
	}

	interface Order {
		id: number;
		user: number;
		restaurant: number;
		order_status: string;
		total_price: string;
		created_at: string;
		order_type: string;
		items: OrderItem[];
	}

	let orders: Order[] = [];
	let loading = true;
	let error = '';

	onMount(() => {
		// Check if user is authenticated
		if (!$authStore.isAuthenticated) {
			goto('/');
			return;
		}
		
		loadOrders();
	});

	async function loadOrders() {
		try {
			loading = true;
			error = '';

			// Call the backend orders endpoint
			const response = await apiFetch(`${env.PUBLIC_BACKEND_URL}/api/order/`);
			// Handle paginated response
			orders = response?.results || response || [];
		} catch (err) {
			console.error('Error loading orders:', err);
			error = 'Захиалгуудыг ачааллахад алдаа гарлаа';
		} finally {
			loading = false;
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'PENDING': return 'text-yellow-600 bg-yellow-100';
			case 'PREPARING': return 'text-blue-600 bg-blue-100';
			case 'IN_BOX': return 'text-green-600 bg-green-100';
			case 'DONE': return 'text-green-700 bg-green-200';
			case 'CANCELLED': return 'text-red-600 bg-red-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('mn-MN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function viewOrder(orderId: number) {
		goto(`/order/${orderId}`);
	}
</script>

<svelte:head>
	<title>Миний захиалгууд - Tomah</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<button 
			on:click={() => goto('/')}
			class="flex items-center text-gray-600 hover:text-gray-800 mb-4"
		>
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Буцах
		</button>
		<h1 class="text-2xl font-bold">Миний захиалгууд</h1>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
			<span class="ml-3 text-gray-600">Ачааллаж байна...</span>
		</div>
	{:else if error}
		<div class="rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
			<p class="text-sm">{error}</p>
		</div>
		<button 
			on:click={loadOrders}
			class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
		>
			Дахин оролдох
		</button>
	{:else if orders.length === 0}
		<div class="text-center py-12">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Захиалга байхгүй</h3>
			<p class="mt-1 text-sm text-gray-500">Та анхны захиалгаа хийж эхэлнэ үү!</p>
			<div class="mt-6">
				<button
					on:click={() => goto('/')}
					class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
				>
					Захиалга хийх
				</button>
			</div>
		</div>
	{:else}
		<div class="space-y-4">
			{#each orders as order}
				<div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
					 on:click={() => viewOrder(order.id)}
					 role="button"
					 tabindex="0"
					 on:keydown={(e) => {
						 if (e.key === 'Enter' || e.key === ' ') {
							 e.preventDefault();
							 viewOrder(order.id);
						 }
					 }}>
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<div class="flex items-center justify-between mb-2">
								<h3 class="font-semibold text-lg">#{order.id}</h3>
								<span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
									{ORDER_STATUS_LABELS[order.order_status] || order.order_status}
								</span>
							</div>
							
							<p class="text-gray-600 mb-1">Restaurant #{order.restaurant}</p>
							<p class="text-sm text-gray-500 mb-2">{formatDate(order.created_at)}</p>
							<div class="text-sm text-gray-500">
								{#each order.items as item, index}
									<span>{item.quantity}x {item.menu_item.name}</span>{#if index < order.items.length - 1}, {/if}
								{/each}
							</div>
						</div>
						
						<div class="text-right ml-4">
							<p class="font-semibold text-lg">{parseFloat(order.total_price).toLocaleString()}₮</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>