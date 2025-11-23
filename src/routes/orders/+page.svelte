<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { ORDER_STATUS_LABELS } from '$lib/utils/order';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import type { Restaurant } from '$lib/types/restaurant';
	import Pagination from '$lib/components/common/Pagination.svelte';

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

	interface PaginatedResponse {
		count: number;
		next: string | null;
		previous: string | null;
		results: Order[];
	}

	let orders: Order[] = [];
	let restaurants: Restaurant[] = [];
	let groupedOrders: GroupedOrders[] = [];
	let loading = true;
	let error = '';

	// Pagination state
	let currentPage = 1;
	let pageSize = 10;
	let totalCount = 0;
	let totalPages = 1;

	onMount(() => {
		// Check if user is authenticated
		if (!$authStore.isAuthenticated) {
			goto('/');
			return;
		}

		loadData(currentPage);
	});

	async function loadData(page: number = 1) {
		try {
			loading = true;
			error = '';

			// Reset orders before loading new page
			orders = [];
			groupedOrders = [];

			// Load both orders and restaurants
			const [ordersResponse, restaurantsResponse] = await Promise.all([
				apiFetch(`${env.PUBLIC_BACKEND_URL}/api/order/?limit=${pageSize}&page=${page}`),
				apiFetch(`${env.PUBLIC_BACKEND_URL}/api/restaurants/`)
			]);

			const paginatedOrders = ordersResponse as PaginatedResponse;
			orders = paginatedOrders?.results || [];
			totalCount = paginatedOrders?.count || 0;
			totalPages = Math.ceil(totalCount / pageSize);

			restaurants =
				(restaurantsResponse as any)?.results || (restaurantsResponse as Restaurant[]) || [];

			// Group orders by restaurant
			groupOrders();
		} catch (err) {
			error = 'Захиалгуудыг ачааллахад алдаа гарлаа';
		} finally {
			loading = false;
		}
	}

	function handlePageChange(event: CustomEvent<{ page: number }>) {
		currentPage = event.detail.page;
		loadData(currentPage);
		// Scroll to top of the page
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function groupOrders() {
		const ordersByRestaurant = new Map<number, Order[]>();

		// Group orders by restaurant ID
		orders.forEach((order) => {
			const restaurantId = order.restaurant;
			if (!ordersByRestaurant.has(restaurantId)) {
				ordersByRestaurant.set(restaurantId, []);
			}
			ordersByRestaurant.get(restaurantId)!.push(order);
		});

		// Create grouped orders with restaurant information
		groupedOrders = Array.from(ordersByRestaurant.entries())
			.map(([restaurantId, orderList]) => {
				const restaurant = restaurants.find((r) => parseInt(r.id) === restaurantId) || {
					id: restaurantId.toString(),
					name: `Restaurant #${restaurantId}`,
					logo: '',
					address: '',
					restaurant_img_urls: [],
					is_liked: false
				};

				return {
					restaurant,
					orders: orderList.sort(
						(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					)
				};
			})
			.sort((a, b) => {
				// Sort by most recent order date within each restaurant group
				const aLatest = new Date(a.orders[0]?.created_at || 0);
				const bLatest = new Date(b.orders[0]?.created_at || 0);
				return bLatest.getTime() - aLatest.getTime();
			});
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'PENDING':
				return 'text-yellow-600 bg-yellow-100';
			case 'PREPARING':
				return 'text-blue-600 bg-blue-100';
			case 'IN_BOX':
				return 'text-green-600 bg-green-100';
			case 'DONE':
				return 'text-green-700 bg-green-200';
			case 'CANCELLED':
				return 'text-red-600 bg-red-100';
			default:
				return 'text-gray-600 bg-gray-100';
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
			class="mb-4 flex items-center text-gray-600 hover:text-gray-800"
		>
			<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Буцах
		</button>
		<h1 class="text-2xl font-bold">Миний захиалгууд</h1>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"
			></div>
			<span class="ml-3 text-gray-600">Ачааллаж байна...</span>
		</div>
	{:else if error}
		<div class="rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<p class="text-sm">{error}</p>
		</div>
		<button
			on:click={() => loadData(currentPage)}
			class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
		>
			Дахин оролдох
		</button>
	{:else if orders.length === 0}
		<div class="py-12 text-center">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">Захиалга байхгүй</h3>
			<p class="mt-1 text-sm text-gray-500">Та анхны захиалгаа хийж эхэлнэ үү!</p>
			<div class="mt-6">
				<button
					on:click={() => goto('/')}
					class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
				>
					Захиалга хийх
				</button>
			</div>
		</div>
	{:else}
		<div class="space-y-6">
			{#each groupedOrders as group (group.restaurant.id)}
				<div class="rounded-lg bg-gray-50 p-4">
					<div class="mb-4 flex items-center">
						{#if group.restaurant.logo}
							<img
								src={group.restaurant.logo}
								alt={group.restaurant.name}
								class="mr-3 h-12 w-12 rounded-lg object-cover"
							/>
						{:else}
							<div class="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-300">
								<svg
									class="h-6 w-6 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</div>
						{/if}
						<div>
							<h2 class="text-lg font-semibold text-gray-900">{group.restaurant.name}</h2>
							<p class="text-sm text-gray-600">{group.orders.length} захиалга</p>
						</div>
					</div>

					<div class="space-y-3">
						{#each group.orders as order (order.id)}
							<div
								class="cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
								on:click={() => viewOrder(order.id)}
								role="button"
								tabindex="0"
								on:keydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										viewOrder(order.id);
									}
								}}
							>
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<div class="mb-2 flex items-center justify-between">
											<h3 class="text-base font-semibold">#{order.id}</h3>
											<span
												class={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.order_status)}`}
											>
												{ORDER_STATUS_LABELS[order.order_status] || order.order_status}
											</span>
										</div>

										<p class="mb-2 text-sm text-gray-500">{formatDate(order.created_at)}</p>
										<div class="text-sm text-gray-500">
											{#each order.items as item, index}
												<span>{item.quantity}x {item.menu_item.name}</span
												>{#if index < order.items.length - 1},
												{/if}
											{/each}
										</div>
									</div>

									<div class="ml-4 text-right">
										<p class="text-lg font-semibold">
											{parseFloat(order.total_price).toLocaleString()}₮
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="mt-6">
				<Pagination
					{currentPage}
					{totalPages}
					{totalCount}
					{pageSize}
					on:pageChange={handlePageChange}
				/>
			</div>
		{/if}
	{/if}
</div>
