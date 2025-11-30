<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		getOrderStatus,
		ORDER_STATUS_LABELS,
		PAYMENT_STATUS_LABELS,
		type Order
	} from '$lib/utils/order';
	import { Printer, Download } from 'lucide-svelte';
	import QRCode from 'qrcode';

	export let orderId: number;
	export let autoRefresh = true;
	export let refreshInterval = 15000; // 15 seconds

	let order: Order | null = null;
	let loading = true;
	let error = '';
	let intervalId: NodeJS.Timeout | null = null;
	let isInitialLoad = true;
	let qrCodeDataUrl = '';

	async function loadOrderStatus(silent = false) {
		try {
			if (!silent) {
				loading = true;
			}
			error = '';

			const result = await getOrderStatus(orderId);

			if (result.success && result.order) {
				order = result.order;
				if (!qrCodeDataUrl) {
					await generateQRCode();
				}
			} else {
				error = result.error || 'Захиалгын мэдээлэл авахад алдаа гарлаа';
			}
		} catch (err) {
			error = 'Сүлжээний алдаа гарлаа';
		} finally {
			if (!silent) {
				loading = false;
			}
			isInitialLoad = false;
		}
	}

	async function generateQRCode() {
		if (!order) return;
		try {
			qrCodeDataUrl = await QRCode.toDataURL(`ORDER-${order.id}`, {
				width: 150,
				margin: 1
			});
		} catch (err) {
			// QR code generation failed, continue without it
		}
	}

	function startAutoRefresh() {
		if (autoRefresh && !intervalId) {
			intervalId = setInterval(() => loadOrderStatus(true), refreshInterval);
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

	function handlePrint() {
		window.print();
	}

	function calculateSubtotal(): number {
		if (!order) return 0;
		return order.items.reduce((sum, item) => {
			return sum + parseFloat(item.unit_price) * item.quantity;
		}, 0);
	}
</script>

<div class="mx-auto max-w-md">
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
			<!-- Print/Download Actions (No Print) - Only show if vat_receipt exists -->
			{#if order.vat_receipt}
				<div class="no-print mb-4 flex gap-3">
					<button
						on:click={handlePrint}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
					>
						<Printer class="h-4 w-4" />
						<span>Хэвлэх</span>
					</button>
					<button
						on:click={handlePrint}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
					>
						<Download class="h-4 w-4" />
						<span>Татаж авах</span>
					</button>
				</div>
			{/if}

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
					<h3 class="mb-2 font-medium">Төлбөрийн мэдээлэл</h3>
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Төлбөрийн төлөв:</span>
							<span
								class={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(order.payment.status)}`}
							>
								{PAYMENT_STATUS_LABELS[order.payment.status] || order.payment.status}
							</span>
						</div>
						{#if order.payment.payment_method}
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Төлбөрийн хэлбэр:</span>
								<span class="text-sm font-medium text-gray-900">{order.payment.payment_method}</span
								>
							</div>
						{/if}
						{#if order.payment.status === 'PENDING' && order.payment.payment_url}
							<a
								href={order.payment.payment_url}
								class="no-print mt-2 block rounded-lg bg-blue-500 px-4 py-2 text-center text-sm text-white hover:bg-blue-600"
							>
								Төлбөр төлөх
							</a>
						{/if}
					</div>
				</div>
			{/if}

			{#if order.vat_receipt}
				<!-- Order Items Detail Table -->
				<div class="border-b pb-4">
					<h3 class="mb-3 font-medium">Захиалгын жагсаалт</h3>
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b">
									<th class="pb-2 text-left font-medium text-gray-600">Бүтээгдэхүүн</th>
									<th class="pb-2 text-center font-medium text-gray-600">Тоо</th>
									<th class="pb-2 text-right font-medium text-gray-600">Нэгж үнэ</th>
									<th class="pb-2 text-right font-medium text-gray-600">Нийт</th>
								</tr>
							</thead>
							<tbody>
								{#each order.items as item}
									<tr class="border-b border-gray-100">
										<td class="py-2 text-gray-900">{item.menu_item?.name || 'Бүтээгдэхүүн'}</td>
										<td class="py-2 text-center text-gray-700">{item.quantity}</td>
										<td class="py-2 text-right text-gray-700"
											>{parseFloat(item.unit_price).toLocaleString()}₮</td
										>
										<td class="py-2 text-right font-medium text-gray-900"
											>{(parseFloat(item.unit_price) * item.quantity).toLocaleString()}₮</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<!-- Total -->
				<div class="border-b pb-4">
					<div class="flex items-center justify-between">
						<span class="text-lg font-bold">НИЙТ ТӨЛБӨР:</span>
						<span class="text-xl font-bold text-red-600"
							>{parseFloat(order.total_price).toLocaleString()}₮</span
						>
					</div>
				</div>

				<!-- QR Code -->
				{#if qrCodeDataUrl}
					<div class="border-b pb-4 text-center">
						<p class="mb-2 text-sm text-gray-500">Баримтын QR код</p>
						<img src={qrCodeDataUrl} alt="QR Code" class="mx-auto" />
					</div>
				{/if}

				<!-- Company Footer Info -->
				<div class="text-center text-xs text-gray-500">
					<p class="mb-1 font-medium text-gray-600">QPick - Smart Locker System</p>
					<p class="mb-1">Чингисийн өргөн чөлөө 33/5, Үйлдвэр 10/17042</p>
					<p class="mb-1">Утас: (976) 8844-5135</p>
					<p>И-мэйл: Tomax.2k21@gmail.com</p>
				</div>
			{:else}
				<!-- Simple Order Items List (when no vat_receipt) -->
				<div class="border-b pb-4">
					<h3 class="mb-3 font-medium">Захиалсан бүтээгдэхүүн</h3>
					<div class="space-y-2">
						{#each order.items as item}
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-900"
									>{item.quantity}x {item.menu_item?.name || 'Бүтээгдэхүүн'}</span
								>
								<span class="font-medium"
									>{(parseFloat(item.unit_price) * item.quantity).toLocaleString()}₮</span
								>
							</div>
						{/each}
					</div>
				</div>

				<!-- Simple Total (when no vat_receipt) -->
				<div class="border-b pb-4">
					<div class="flex items-center justify-between">
						<span class="font-medium">Нийт дүн:</span>
						<span class="text-lg font-semibold text-red-600"
							>{parseFloat(order.total_price).toLocaleString()}₮</span
						>
					</div>
				</div>
			{/if}

			<!-- Auto Refresh Indicator -->
			{#if autoRefresh && (order.order_status === 'PENDING' || order.order_status === 'PREPARING')}
				<div class="no-print text-center text-sm text-gray-500">
					<div class="inline-flex items-center">
						<div class="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
						Автоматаар шинэчлэгдэж байна
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	@media print {
		.no-print {
			display: none !important;
		}

		@page {
			margin: 1cm;
		}
	}
</style>
