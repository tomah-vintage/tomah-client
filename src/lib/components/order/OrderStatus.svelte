<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		getOrderStatus,
		ORDER_STATUS_LABELS,
		PAYMENT_STATUS_LABELS,
		type Order
	} from '$lib/utils/order';
	import { Receipt } from 'lucide-svelte';

	export let orderId: number;
	export let autoRefresh = true;
	export let refreshInterval = 5000; // 5 seconds

	let order: Order | null = null;
	let loading = true;
	let error = '';
	let intervalId: NodeJS.Timeout | null = null;

	async function loadOrderStatus() {
		try {
			loading = true;
			error = '';

			const result = await getOrderStatus(orderId);

			if (result.success && result.order) {
				order = result.order;
			} else {
				error = result.error || 'Захиалгын мэдээлэл авахад алдаа гарлаа';
			}
		} catch (err) {
			error = 'Сүлжээний алдаа гарлаа';
		} finally {
			loading = false;
		}
	}

	function startAutoRefresh() {
		if (autoRefresh && !intervalId) {
			intervalId = setInterval(loadOrderStatus, refreshInterval);
		}
	}

	function stopAutoRefresh() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	onMount(() => {
		loadOrderStatus();
		startAutoRefresh();
	});

	onDestroy(() => {
		stopAutoRefresh();
	});

	// Stop auto-refresh when order is completed or cancelled
	$: if (order && (order.order_status === 'DONE' || order.order_status === 'CANCELLED')) {
		stopAutoRefresh();
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

	function getPaymentStatusColor(status: string): string {
		switch (status) {
			case 'PENDING':
				return 'text-yellow-600 bg-yellow-100';
			case 'PAID':
				return 'text-green-600 bg-green-100';
			case 'FAILED':
				return 'text-red-600 bg-red-100';
			case 'EXPIRED':
				return 'text-gray-600 bg-gray-100';
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
</script>

<div class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
	<h2 class="mb-4 text-xl font-bold">Захиалгын мэдээлэл</h2>

	{#if loading}
		<div class="flex items-center justify-center py-8">
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
			on:click={loadOrderStatus}
			class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
		>
			Дахин оролдох
		</button>
	{:else if order}
		<div class="space-y-4">
			<!-- Order Info -->
			<div class="border-b pb-4">
				<div class="mb-2 flex items-center justify-between">
					<span class="font-medium">Захиалгын дугаар:</span>
					<span class="text-gray-600">#{order.id}</span>
				</div>
				<div class="mb-2 flex items-center justify-between">
					<span class="font-medium">Огноо:</span>
					<span class="text-gray-600">{formatDate(order.created_at)}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="font-medium">Нийт дүн:</span>
					<span class="text-lg font-semibold"
						>{parseFloat(order.total_price).toLocaleString()}₮</span
					>
				</div>
			</div>

			<!-- Order Status -->
			<div class="border-b pb-4">
				<h3 class="mb-2 font-medium">Захиалгын төлөв</h3>
				<div class="flex items-center">
					<span
						class={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.order_status)}`}
					>
						{ORDER_STATUS_LABELS[order.order_status] || order.order_status}
					</span>
				</div>
			</div>

			<!-- Payment Status -->
			{#if order.payment}
				<div class="border-b pb-4">
					<h3 class="mb-2 font-medium">Төлбөрийн төлөв</h3>
					<div class="flex items-center justify-between">
						<span
							class={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(order.payment.status)}`}
						>
							{PAYMENT_STATUS_LABELS[order.payment.status] || order.payment.status}
						</span>
						{#if order.payment.status === 'PENDING' && order.payment.payment_url}
							<a
								href={order.payment.payment_url}
								class="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
							>
								Төлбөр төлөх
							</a>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Order Items -->
			<div>
				<h3 class="mb-2 font-medium">Захиалсан бүтээгдэхүүн</h3>
				<div class="space-y-2">
					{#each order.items as item}
						<div class="flex items-center justify-between text-sm">
							<span class="text-gray-600">{item.quantity}x</span>
							<span class="font-medium">{parseFloat(item.unit_price).toLocaleString()}₮</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Receipt Link -->
			<div class="pt-4">
				<a
					href="/order/{orderId}/receipt"
					class="flex items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-white px-4 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
				>
					<Receipt class="h-5 w-5" />
					<span>Цахим баримт харах</span>
				</a>
			</div>

			<!-- Auto Refresh Indicator -->
			{#if autoRefresh && (order.order_status === 'PENDING' || order.order_status === 'PREPARING')}
				<div class="text-center text-sm text-gray-500">
					<div class="inline-flex items-center">
						<div class="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
						Автоматаар шинэчлэгдэж байна
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
