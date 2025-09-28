<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getOrderStatus, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, type Order } from '$lib/utils/order';
	import { CheckCircle, Clock, XCircle } from 'lucide-svelte';

	let order: Order | null = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		const orderId = $page.url.searchParams.get('orderId');
		
		if (!orderId) {
			error = 'Захиалгын дугаар олдсонгүй';
			loading = false;
			return;
		}

		try {
			const response = await getOrderStatus(parseInt(orderId));
			
			if (response.success && response.order) {
				order = response.order;
			} else {
				error = response.error || 'Захиалгын мэдээлэл авахад алдаа гарлаа';
			}
		} catch (err) {
			error = 'Сүлжээний алдаа гарлаа';
		} finally {
			loading = false;
		}
	});

	function getPaymentStatusIcon(status: string) {
		switch (status) {
			case 'PAID':
				return CheckCircle;
			case 'PENDING':
				return Clock;
			case 'FAILED':
			case 'EXPIRED':
				return XCircle;
			default:
				return Clock;
		}
	}

	function getPaymentStatusColor(status: string) {
		switch (status) {
			case 'PAID':
				return 'text-green-600';
			case 'PENDING':
				return 'text-yellow-600';
			case 'FAILED':
			case 'EXPIRED':
				return 'text-red-600';
			default:
				return 'text-gray-600';
		}
	}
</script>

<svelte:head>
	<title>Төлбөрийн үр дүн - Tomah</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 lg:bg-white lg:py-8">
	<div class="mx-auto max-w-2xl lg:px-4">
		<div class="bg-white p-4 lg:m-5 lg:rounded-2xl lg:p-6 lg:shadow-lg">
			{#if loading}
				<div class="text-center py-8">
					<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
					<p class="mt-4 text-gray-600">Захиалгын мэдээлэл ачааллаж байна...</p>
				</div>
			{:else if error}
				<div class="text-center py-8">
					<XCircle class="mx-auto h-16 w-16 text-red-500 mb-4" />
					<h2 class="text-xl font-bold text-gray-900 mb-2">Алдаа гарлаа</h2>
					<p class="text-gray-600 mb-6">{error}</p>
					<button
						on:click={() => goto('/')}
						class="rounded-lg bg-red-500 px-6 py-3 text-white font-medium hover:bg-red-600"
					>
						Буцах
					</button>
				</div>
			{:else if order}
				<div class="text-center py-8">
					{#if order.payment?.status === 'PAID' || order.order_status === 'PREPARING'}
						<CheckCircle class="mx-auto h-16 w-16 text-green-500 mb-4" />
						<h2 class="text-xl font-bold text-gray-900 mb-2">Төлбөр амжилттай төлөгдлөө!</h2>
						<p class="text-gray-600 mb-6">Таны захиалга амжилттай үүсэгдлээ</p>
					{:else if order.payment?.status === 'PENDING'}
						<Clock class="mx-auto h-16 w-16 text-yellow-500 mb-4" />
						<h2 class="text-xl font-bold text-gray-900 mb-2">Төлбөр хүлээгдэж байна</h2>
						<p class="text-gray-600 mb-6">Таны төлбөр баталгаажуулалт хүлээгдэж байна</p>
					{:else}
						<XCircle class="mx-auto h-16 w-16 text-red-500 mb-4" />
						<h2 class="text-xl font-bold text-gray-900 mb-2">Төлбөр амжилтгүй</h2>
						<p class="text-gray-600 mb-6">Төлбөр төлөхөд алдаа гарлаа</p>
					{/if}

					<!-- Order Details -->
					<div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
						<h3 class="font-semibold text-gray-900 mb-3">Захиалгын дэлгэрэнгүй</h3>
						
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600">Захиалгын дугаар:</span>
								<span class="font-medium">#{order.id}</span>
							</div>
							
							<div class="flex justify-between">
								<span class="text-gray-600">Нийт дүн:</span>
								<span class="font-medium">{parseInt(order.total_price).toLocaleString()}₮</span>
							</div>
							
							<div class="flex justify-between">
								<span class="text-gray-600">Захиалгын төрөл:</span>
								<span class="font-medium">{order.order_type === 'DINE_IN' ? 'Ширээний дээр идэх' : 'Авч явах'}</span>
							</div>
							
							{#if order.table}
								<div class="flex justify-between">
									<span class="text-gray-600">Ширээ:</span>
									<span class="font-medium">#{order.table}</span>
								</div>
							{/if}
							
							<div class="flex justify-between">
								<span class="text-gray-600">Захиалгын статус:</span>
								<span class="font-medium">{ORDER_STATUS_LABELS[order.order_status] || order.order_status}</span>
							</div>
							
							{#if order.payment}
								<div class="flex justify-between">
									<span class="text-gray-600">Төлбөрийн статус:</span>
									<span class="font-medium {getPaymentStatusColor(order.payment.status)}">
										{PAYMENT_STATUS_LABELS[order.payment.status] || order.payment.status}
									</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Order Items -->
					{#if order.items && order.items.length > 0}
						<div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
							<h3 class="font-semibold text-gray-900 mb-3">Захиалсан бараанууд</h3>
							<div class="space-y-2">
								{#each order.items as item}
									<div class="flex justify-between text-sm">
										<span class="text-gray-600">{item.menu_item.name} x{item.quantity}</span>
										<span class="font-medium">{(parseInt(item.unit_price) * item.quantity).toLocaleString()}₮</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Action buttons -->
					<div class="space-y-3">
						{#if order.payment?.status === 'PAID' || order.order_status === 'PREPARING'}
							<button
								on:click={() => goto(`/order/${order.id}`)}
								class="w-full rounded-lg bg-red-500 py-3 text-white font-medium hover:bg-red-600"
							>
								Захиалгын дэлгэрэнгүй харах
							</button>
							<button
								on:click={() => goto('/orders')}
								class="w-full rounded-lg border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-50"
							>
								Миний захиалгууд
							</button>
						{:else if order.payment?.status === 'FAILED' || order.payment?.status === 'EXPIRED'}
							<button
								on:click={() => goto('/')}
								class="w-full rounded-lg bg-red-500 py-3 text-white font-medium hover:bg-red-600"
							>
								Дахин захиалах
							</button>
						{:else}
							<button
								on:click={() => goto(`/order/${order.id}`)}
								class="w-full rounded-lg bg-red-500 py-3 text-white font-medium hover:bg-red-600"
							>
								Захиалгын дэлгэрэнгүй харах
							</button>
						{/if}
						
						<button
							on:click={() => goto('/')}
							class="w-full rounded-lg border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-50"
						>
							Нүүр хуудас
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>