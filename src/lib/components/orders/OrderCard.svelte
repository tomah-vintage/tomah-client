<script lang="ts">
	import type { Order } from '$lib/types/order';

	export let order: Order;

	const statusColors = {
		PENDING: 'bg-yellow-100 text-yellow-800',
		PREPARING: 'bg-blue-100 text-blue-800',
		READY: 'bg-orange-100 text-orange-800',
		CANCELLED: 'bg-red-100 text-red-800',
		IN_BOX: 'bg-purple-100 text-purple-800',
		DONE: 'bg-green-100 text-green-800'
	};

	const statusLabels = {
		PENDING: 'Хүлээгдэж байна',
		PREPARING: 'Бэлтгэж байна',
		READY: 'Хайрцагт хийгдэж байна',
		CANCELLED: 'Цуцлагдсан',
		IN_BOX: 'Хайрцагт байна',
		DONE: 'Дууссан'
	};

	const orderTypeLabels = {
		DINE_IN: 'Газар дээр',
		TAKE_OUT: 'Авч явах'
	};

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('mn-MN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatPrice(price: string): string {
		return parseFloat(price).toLocaleString() + '₮';
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
	<div class="p-6">
		<div class="flex items-start justify-between mb-4">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-2">
					<h3 class="text-lg font-semibold text-gray-900">
						Ресторан #{order.restaurant}
					</h3>
					<span class="px-3 py-1 text-xs font-medium rounded-full {statusColors[order.order_status]}">
						{statusLabels[order.order_status]}
					</span>
				</div>
				<div class="flex items-center gap-4 text-sm text-gray-500">
					<span>Захиалга #{order.id}</span>
					{#if order.created_at}
						<span>• {formatDate(order.created_at)}</span>
					{/if}
					<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
						{orderTypeLabels[order.order_type]}
					</span>
				</div>
			</div>
			<div class="text-right">
				<div class="text-2xl font-bold text-gray-900">{formatPrice(order.total_price)}</div>
				<div class="text-sm text-gray-500">{order.items.length} зүйл</div>
			</div>
		</div>

		<div class="bg-gray-50 rounded-lg p-4">
			<h4 class="font-medium text-gray-900 mb-3">Захиалсан зүйлс</h4>
			<div class="space-y-2">
				{#each order.items as item}
					<div class="flex justify-between items-center">
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
								<span class="text-xs font-medium text-red-600">#{item.menu_item}</span>
							</div>
							<span class="text-gray-700">Бүтээгдэхүүн #{item.menu_item}</span>
						</div>
						<div class="text-right">
							<div class="font-medium text-gray-900">{formatPrice(item.unit_price)}</div>
							<div class="text-sm text-gray-500">× {item.quantity}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		{#if order.table || order.box}
			<div class="mt-4 flex gap-4 text-sm">
				{#if order.table}
					<div class="flex items-center gap-2 text-gray-600">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
						</svg>
						Ширээ: {order.table.number}
					</div>
				{/if}
				{#if order.box}
					<div class="flex items-center gap-2 text-gray-600">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
						</svg>
						Хайрцаг: {order.box.name}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>