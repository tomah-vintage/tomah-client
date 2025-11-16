<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { getOrderStatus, ORDER_STATUS_LABELS, type Order } from '$lib/utils/order';
	import { Printer, Download, ArrowLeft } from 'lucide-svelte';
	import QRCode from 'qrcode';

	let orderId: number;
	let order: Order | null = null;
	let loading = true;
	let error = '';
	let qrCodeDataUrl = '';

	onMount(async () => {
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
		await loadOrder();
	});

	async function loadOrder() {
		try {
			loading = true;
			error = '';

			const result = await getOrderStatus(orderId);

			if (result.success && result.order) {
				order = result.order;
				// Generate QR code for order verification
				await generateQRCode();
			} else {
				error = result.error || 'Захиалгын мэдээлэл авахад алдаа гарлаа';
			}
		} catch (err) {
			console.error('Error loading order:', err);
			error = 'Сүлжээний алдаа гарлаа';
		} finally {
			loading = false;
		}
	}

	async function generateQRCode() {
		if (!order) return;
		try {
			// Generate QR code with order ID
			qrCodeDataUrl = await QRCode.toDataURL(`ORDER-${order.id}`, {
				width: 150,
				margin: 1
			});
		} catch (err) {
			console.error('Error generating QR code:', err);
		}
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('mn-MN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handlePrint() {
		window.print();
	}

	async function handleDownloadPDF() {
		// For now, use print to PDF functionality
		// In the future, can integrate a library like jsPDF
		window.print();
	}

	function calculateSubtotal(): number {
		if (!order) return 0;
		return order.items.reduce((sum, item) => {
			return sum + parseFloat(item.unit_price) * item.quantity;
		}, 0);
	}
</script>

<svelte:head>
	<title>Цахим баримт - Захиалга #{orderId}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Action Buttons (No Print) -->
	<div class="no-print sticky top-0 z-10 border-b bg-white shadow-sm">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<button
				on:click={() => goto(`/order/${orderId}`)}
				class="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
			>
				<ArrowLeft class="h-5 w-5" />
				<span>Буцах</span>
			</button>

			<div class="flex gap-3">
				<button
					on:click={handlePrint}
					class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					<Printer class="h-4 w-4" />
					<span>Хэвлэх</span>
				</button>
				<button
					on:click={handleDownloadPDF}
					class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
				>
					<Download class="h-4 w-4" />
					<span>Татаж авах</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Receipt Content -->
	<div class="container mx-auto max-w-3xl px-4 py-8">
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
		{:else if order}
			<div class="receipt rounded-lg bg-white p-8 shadow-lg md:p-12">
				<!-- Header -->
				<div class="mb-8 border-b-2 border-gray-200 pb-6 text-center">
					<h1 class="mb-2 text-3xl font-bold text-gray-900">ЦАХИМ БАРИМТ</h1>
					<p class="text-sm text-gray-500">QPick Smart Locker</p>
				</div>

				<!-- Receipt Number and Date -->
				<div class="mb-8">
					<div class="mb-4 flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-500">Баримтын дугаар</p>
							<p class="text-xl font-bold text-gray-900">#{order.id}</p>
						</div>
						<div class="text-right">
							<p class="text-sm text-gray-500">Огноо</p>
							<p class="font-medium text-gray-900">{formatDate(order.created_at)}</p>
						</div>
					</div>

					<div class="rounded-lg bg-gray-50 p-4">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Төлөв:</span>
							<span
								class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
							>
								{ORDER_STATUS_LABELS[order.order_status] || order.order_status}
							</span>
						</div>
					</div>
				</div>

				<!-- Customer Info (if available) -->
				{#if order.user}
					<div class="mb-8">
						<h3 class="mb-3 text-sm font-semibold uppercase text-gray-500">
							Харилцагчийн мэдээлэл
						</h3>
						<div class="rounded-lg border border-gray-200 p-4">
							<p class="text-gray-700">Захиалагч: Хэрэглэгч #{order.user}</p>
						</div>
					</div>
				{/if}

				<!-- Order Items -->
				<div class="mb-8">
					<h3 class="mb-4 text-sm font-semibold uppercase text-gray-500">Захиалгын жагсаалт</h3>
					<table class="w-full">
						<thead>
							<tr class="border-b-2 border-gray-200">
								<th class="pb-3 text-left text-sm font-semibold text-gray-600">Бүтээгдэхүүн</th
								>
								<th class="pb-3 text-center text-sm font-semibold text-gray-600">Тоо ширхэг</th>
								<th class="pb-3 text-right text-sm font-semibold text-gray-600">Нэгж үнэ</th>
								<th class="pb-3 text-right text-sm font-semibold text-gray-600">Нийт</th>
							</tr>
						</thead>
						<tbody>
							{#each order.items as item}
								<tr class="border-b border-gray-100">
									<td class="py-3 text-gray-900">{item.menu_item?.name || 'Бүтээгдэхүүн'}</td>
									<td class="py-3 text-center text-gray-700">{item.quantity}</td>
									<td class="py-3 text-right text-gray-700"
										>{parseFloat(item.unit_price).toLocaleString()}₮</td
									>
									<td class="py-3 text-right font-medium text-gray-900"
										>{(parseFloat(item.unit_price) * item.quantity).toLocaleString()}₮</td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Totals -->
				<div class="mb-8 border-t-2 border-gray-200 pt-4">
					<div class="space-y-2">
						<div class="flex justify-between">
							<span class="text-gray-600">Нийт дүн:</span>
							<span class="font-medium text-gray-900"
								>{calculateSubtotal().toLocaleString()}₮</span
							>
						</div>
						<!-- Add tax or service fee if applicable -->
						<!-- <div class="flex justify-between">
							<span class="text-gray-600">НӨАТ (10%):</span>
							<span class="font-medium text-gray-900">0₮</span>
						</div> -->
						<div class="flex justify-between border-t pt-2">
							<span class="text-lg font-bold text-gray-900">НИЙТ ТӨЛБӨР:</span>
							<span class="text-xl font-bold text-red-600"
								>{parseFloat(order.total_price).toLocaleString()}₮</span
							>
						</div>
					</div>
				</div>

				<!-- Payment Info -->
				{#if order.payment}
					<div class="mb-8">
						<h3 class="mb-3 text-sm font-semibold uppercase text-gray-500">Төлбөрийн мэдээлэл</h3>
						<div class="rounded-lg border border-gray-200 p-4">
							<div class="flex justify-between">
								<span class="text-gray-600">Төлбөрийн хэлбэр:</span>
								<span class="font-medium text-gray-900"
									>{order.payment.payment_method || 'Цахим төлбөр'}</span
								>
							</div>
							<div class="mt-2 flex justify-between">
								<span class="text-gray-600">Төлбөрийн төлөв:</span>
								<span
									class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
								>
									{order.payment.status === 'PAID' ? 'Төлсөн' : 'Хүлээгдэж буй'}
								</span>
							</div>
						</div>
					</div>
				{/if}

				<!-- QR Code -->
				{#if qrCodeDataUrl}
					<div class="mb-8 text-center">
						<p class="mb-3 text-sm text-gray-500">Баримтын QR код</p>
						<img src={qrCodeDataUrl} alt="QR Code" class="mx-auto" />
					</div>
				{/if}

				<!-- Footer -->
				<div class="border-t-2 border-gray-200 pt-6 text-center">
					<p class="mb-2 text-sm text-gray-600">QPick - Smart Locker System</p>
					<p class="mb-1 text-xs text-gray-500">Чингисийн өргөн чөлөө 33/5, Үйлдвэр 10/17042</p>
					<p class="mb-1 text-xs text-gray-500">Утас: (976) 8844-5135</p>
					<p class="text-xs text-gray-500">И-мэйл: Tomax.2k21@gmail.com</p>
					<p class="mt-4 text-xs text-gray-400">Баярлалаа! 감사합니다!</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@media print {
		.no-print {
			display: none !important;
		}

		.receipt {
			box-shadow: none !important;
			margin: 0 !important;
			padding: 20px !important;
		}

		body {
			background: white !important;
		}

		@page {
			margin: 1cm;
		}
	}
</style>
