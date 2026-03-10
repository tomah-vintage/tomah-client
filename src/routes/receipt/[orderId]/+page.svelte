<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Download, Printer, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-svelte';
	import type { Order } from '$lib/utils/order';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import QRCode from 'qrcode';

	let orderId = $page.params.orderId;
	let order: Order | null = null;
	let loading = true;
	let error = '';
	let qrCodeDataUrl = '';
	let lotteryCode = '';
	let paymentStatus = '';

	onMount(async () => {
		paymentStatus = $page.url.searchParams.get('status') || '';
		lotteryCode = $page.url.searchParams.get('lottery') || '';
		const qrData = $page.url.searchParams.get('qrData') || '';

		if (qrData) {
			try {
				qrCodeDataUrl = await QRCode.toDataURL(qrData, {
					width: 200,
					margin: 2,
					color: { dark: '#000000', light: '#FFFFFF' }
				});
			} catch (err) {
				console.error('Failed to generate QR code:', err);
			}
		}

		try {
			loading = true;
			const response = await apiFetch(`${env.PUBLIC_BACKEND_URL}/api/order/${orderId}/`);
			order = response as Order;

			// If no lottery from URL, try to get it from order's vat_receipt
			if (!lotteryCode && order?.vat_receipt?.lottery_number) {
				lotteryCode = order.vat_receipt.lottery_number;
			}

			// If no qrData from URL but we have a receipt, we can show just the lottery
			// (qr_data is not stored in DB, only cached briefly in Redis for the redirect)
		} catch (err) {
			error = 'Захиалга ачаалж чадсангүй';
		} finally {
			loading = false;
		}
	});

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

	function handleDownload() {
		window.print();
	}

	$: isSuccess =
		paymentStatus === 'success' ||
		order?.payment?.status === 'PAID' ||
		order?.order_status === 'PREPARING' ||
		order?.order_status === 'IN_BOX' ||
		order?.order_status === 'DONE';

	$: isFailed =
		paymentStatus === 'failed' ||
		order?.payment?.status === 'FAILED' ||
		order?.payment?.status === 'EXPIRED';

	$: subtotal =
		order?.items.reduce((sum, item) => sum + parseFloat(item.unit_price) * item.quantity, 0) || 0;

	$: total = parseFloat(order?.total_price || '0');
</script>

<svelte:head>
	<title>Баримт #{orderId} - Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="container mx-auto max-w-2xl px-4">
		<!-- Action Bar -->
		<div class="mb-6 flex items-center justify-between print:hidden">
			<button
				on:click={() => goto('/orders')}
				class="flex items-center gap-2 text-gray-600 hover:text-gray-800"
			>
				<ArrowLeft class="h-5 w-5" />
				Буцах
			</button>

			{#if isSuccess}
				<div class="flex gap-3">
					<button
						on:click={handleDownload}
						class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
					>
						<Download class="h-4 w-4" />
						Татаж авах
					</button>
					<button
						on:click={handlePrint}
						class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>
						<Printer class="h-4 w-4" />
						Хэвлэх
					</button>
				</div>
			{/if}
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
				<span class="ml-3 text-gray-600">Ачааллаж байна...</span>
			</div>
		{:else if error}
			<div class="rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
				<p class="text-sm">{error}</p>
			</div>
		{:else}
			<div class="rounded-lg bg-white p-8 shadow-lg">
				<!-- Status Header -->
				<div class="mb-8 border-b pb-6 text-center">
					<div class="mb-4 flex justify-center">
						<img src="/white-logo.png" alt="Qpick" class="h-12" />
					</div>
					<h1 class="mb-4 text-3xl font-bold text-gray-900">Баримт</h1>
					{#if isSuccess}
						<div class="flex items-center justify-center gap-2 text-green-600">
							<CheckCircle class="h-6 w-6" />
							<span class="font-medium text-lg">Төлбөр амжилттай төлөгдлөө!</span>
						</div>
						<p class="mt-1 text-sm text-gray-500">Таны захиалга хүлээн авагдлаа</p>
					{:else if isFailed}
						<div class="flex items-center justify-center gap-2 text-red-600">
							<XCircle class="h-6 w-6" />
							<span class="font-medium text-lg">Төлбөр амжилтгүй</span>
						</div>
						<p class="mt-1 text-sm text-gray-500">Дахин оролдоно уу</p>
					{:else}
						<div class="flex items-center justify-center gap-2 text-yellow-600">
							<Clock class="h-6 w-6" />
							<span class="font-medium text-lg">Төлбөр хүлээгдэж байна</span>
						</div>
					{/if}
				</div>

				{#if order}
					<!-- Order Info -->
					<div class="mb-6 grid grid-cols-2 gap-4 border-b pb-6">
						<div>
							<p class="text-sm text-gray-500">Захиалгын дугаар</p>
							<p class="font-semibold text-gray-900">#{order.id}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Огноо</p>
							<p class="font-semibold text-gray-900">{formatDate(order.created_at)}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Захиалгын төрөл</p>
							<p class="font-semibold text-gray-900">
								{order.order_type === 'TAKE_OUT' ? 'Авч явах' : 'Газар дээр идэх'}
							</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Захиалгын төлөв</p>
							<p class="font-semibold text-gray-900">
								{#if order.order_status === 'PENDING'}Хүлээгдэж байна
								{:else if order.order_status === 'PREPARING'}Бэлтгэж байна
								{:else if order.order_status === 'IN_BOX'}Савлагдсан
								{:else if order.order_status === 'DONE'}Дууссан
								{:else}{order.order_status}{/if}
							</p>
						</div>
					</div>

					<!-- Order Items -->
					<div class="mb-6 border-b pb-6">
						<h3 class="mb-4 text-lg font-semibold text-gray-900">Захиалсан хоол</h3>
						<div class="space-y-3">
							{#each order.items as item}
								<div class="flex items-start justify-between">
									<div class="flex gap-3">
										{#if item.menu_item.img_urls && item.menu_item.img_urls[0]}
											<img
												src={item.menu_item.img_urls[0]}
												alt={item.menu_item.name}
												class="h-16 w-16 rounded-lg object-cover"
											/>
										{/if}
										<div>
											<p class="font-medium text-gray-900">{item.menu_item.name}</p>
											<p class="text-sm text-gray-500">
												{item.quantity} × {parseFloat(item.unit_price).toLocaleString()}₮
											</p>
										</div>
									</div>
									<p class="font-semibold text-gray-900">
										{(parseFloat(item.unit_price) * item.quantity).toLocaleString()}₮
									</p>
								</div>
							{/each}
						</div>
					</div>

					<!-- Payment Summary -->
					<div class="mb-6 space-y-2">
						<div class="flex justify-between text-gray-600">
							<span>Нийт дүн</span>
							<span>{subtotal.toLocaleString()}₮</span>
						</div>
						{#if order.order_type === 'TAKE_OUT'}
							<div class="flex justify-between text-gray-600">
								<span>Савлагааны хураамж</span>
								<span>2,000₮</span>
							</div>
						{/if}
						<div class="flex justify-between border-t pt-2 text-lg font-bold text-gray-900">
							<span>Нийт төлсөн дүн</span>
							<span>{total.toLocaleString()}₮</span>
						</div>
					</div>

					<!-- Payment Info -->
					{#if order.payment}
						<div class="mb-6 rounded-lg bg-gray-50 p-4">
							<h4 class="mb-2 font-semibold text-gray-900">Төлбөрийн мэдээлэл</h4>
							<div class="space-y-1 text-sm">
								{#if order.payment.payment_method}
									<div class="flex justify-between">
										<span class="text-gray-600">Төлбөрийн төрөл</span>
										<span class="font-medium text-gray-900">{order.payment.payment_method}</span>
									</div>
								{/if}
								<div class="flex justify-between">
									<span class="text-gray-600">Төлөв</span>
									<span class="font-medium {isSuccess ? 'text-green-600' : isFailed ? 'text-red-600' : 'text-yellow-600'}">
										{order.payment.status === 'PAID' ? 'Төлөгдсөн' :
										 order.payment.status === 'FAILED' ? 'Амжилтгүй' :
										 order.payment.status === 'EXPIRED' ? 'Хугацаа дууссан' : 'Хүлээгдэж байна'}
									</span>
								</div>
							</div>
						</div>
					{/if}

					<!-- VAT Receipt (НӨАТ) -->
					{#if lotteryCode || qrCodeDataUrl}
						<div class="mb-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
							<h4 class="mb-4 text-center font-semibold text-gray-900">НӨАТ-н баримт</h4>
							{#if lotteryCode}
								<div class="mb-4 text-center">
									<p class="mb-1 text-sm text-gray-600">Сугалааны код</p>
									<p class="text-xl font-bold text-gray-900">{lotteryCode}</p>
								</div>
							{/if}
							{#if qrCodeDataUrl}
								<div class="flex justify-center">
									<img src={qrCodeDataUrl} alt="QR Code" class="rounded-lg" />
								</div>
								<p class="mt-2 text-center text-xs text-gray-500">
									НӨАТ-н баримтыг шалгахын тулд QR кодыг уншуулна уу
								</p>
							{/if}
						</div>
					{/if}

					<!-- Action Buttons -->
					<div class="space-y-3 print:hidden">
						{#if isSuccess}
							<button
								on:click={() => goto(`/order/${order?.id}`)}
								class="w-full rounded-lg bg-red-500 py-3 text-white font-medium hover:bg-red-600"
							>
								Захиалгын дэлгэрэнгүй харах
							</button>
						{:else if isFailed}
							<button
								on:click={() => goto('/')}
								class="w-full rounded-lg bg-red-500 py-3 text-white font-medium hover:bg-red-600"
							>
								Дахин захиалах
							</button>
						{/if}
						<button
							on:click={() => goto('/orders')}
							class="w-full rounded-lg border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-50"
						>
							Миний захиалгууд
						</button>
						<button
							on:click={() => goto('/')}
							class="w-full rounded-lg border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-50"
						>
							Нүүр хуудас
						</button>
					</div>
				{/if}

				<!-- Footer -->
				<div class="mt-8 border-t pt-6 text-center text-sm text-gray-500 print:block">
					<p>Баярлалаа! Дахин захиалга өгнө үү.</p>
					<p class="mt-1">www.qpick.mn</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@media print {
		body {
			background: white;
		}
		.print\:hidden {
			display: none !important;
		}
	}
</style>
