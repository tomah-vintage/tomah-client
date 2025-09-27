<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { ORDER_STATUS_LABELS } from '$lib/utils/order';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import type { Restaurant } from '$lib/types/restaurant';

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

	interface GroupedOrders {
		restaurant: Restaurant;
		orders: Order[];
	}

	let orders: Order[] = [];
	let restaurants: Restaurant[] = [];
	let groupedOrders: GroupedOrders[] = [];
	let loading = true;
	let error = '';

	onMount(() => {
		// Check if user is authenticated
		if (!$authStore.isAuthenticated) {
			goto('/');
			return;
		}
		
		loadData();
	});

	async function loadData() {
		try {
			loading = true;
			error = '';

			// Load both orders and restaurants
			const [ordersResponse, restaurantsResponse] = await Promise.all([
				apiFetch(`${env.PUBLIC_BACKEND_URL}/api/order/`),
				apiFetch(`${env.PUBLIC_BACKEND_URL}/api/restaurants/`)
			]);

			orders = ordersResponse?.results || ordersResponse || [];
			restaurants = restaurantsResponse?.results || restaurantsResponse || [];
			
			// Group orders by restaurant
			groupOrders();
		} catch (err) {
			console.error('Error loading data:', err);
			error = 'Захиалгуудыг ачааллахад алдаа гарлаа';
		} finally {
			loading = false;
		}
	}

	function groupOrders() {
		const ordersByRestaurant = new Map<number, Order[]>();
		
		// Group orders by restaurant ID
		orders.forEach(order => {
			const restaurantId = order.restaurant;
			if (!ordersByRestaurant.has(restaurantId)) {
				ordersByRestaurant.set(restaurantId, []);
			}
			ordersByRestaurant.get(restaurantId)!.push(order);
		});

		// Create grouped orders with restaurant information
		groupedOrders = Array.from(ordersByRestaurant.entries()).map(([restaurantId, orderList]) => {
			const restaurant = restaurants.find(r => parseInt(r.id) === restaurantId) || {
				id: restaurantId.toString(),
				name: `Restaurant #${restaurantId}`,
				logo: '',
				address: '',
				restaurant_img_urls: [],
				is_liked: false
			};
			
			return {
				restaurant,
				orders: orderList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			};
		}).sort((a, b) => {
			// Sort by most recent order date within each restaurant group
			const aLatest = new Date(a.orders[0]?.created_at || 0);
			const bLatest = new Date(b.orders[0]?.created_at || 0);
			return bLatest.getTime() - aLatest.getTime();
		});
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
			on:click={loadData}
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
		<div class="space-y-6">
			{#each groupedOrders as group}
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="flex items-center mb-4">
						{#if group.restaurant.logo}
							<img src={group.restaurant.logo} alt={group.restaurant.name} class="w-12 h-12 rounded-lg object-cover mr-3" />
						{:else}
							<div class="w-12 h-12 rounded-lg bg-gray-300 flex items-center justify-center mr-3">
								<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
							</div>
						{/if}
						<div>
							<h2 class="text-lg font-semibold text-gray-900">{group.restaurant.name}</h2>
							<p class="text-sm text-gray-600">{group.orders.length} захиалга</p>
						</div>
					</div>
					
					<div class="space-y-3">
						{#each group.orders as order}
							<div class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
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
											<h3 class="font-semibold text-base">#{order.id}</h3>
											<span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
												{ORDER_STATUS_LABELS[order.order_status] || order.order_status}
											</span>
										</div>
										
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
				</div>
			{/each}
		</div>
	{/if}
</div>