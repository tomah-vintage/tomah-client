<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { CheckCircle2, XCircle, Receipt } from 'lucide-svelte';
	import Modal from '$lib/components/common/Modal.svelte';

	export let showModal = false;
	export let success = true;
	export let title = '';
	export let message = '';
	export let orderId: number | null = null;
	export let amount: string = '';

	const dispatch = createEventDispatcher<{
		close: void;
		viewReceipt: { orderId: number };
		viewOrder: { orderId: number };
	}>();

	function closeModal() {
		dispatch('close');
	}

	function handleViewReceipt() {
		if (orderId) {
			dispatch('viewReceipt', { orderId });
		}
	}

	function handleViewOrder() {
		if (orderId) {
			dispatch('viewOrder', { orderId });
		}
	}
</script>

<Modal {showModal} on:close={closeModal}>
	<div class="flex flex-col items-center py-4">
		{#if success}
			<!-- Success State -->
			<div
				class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
			>
				<CheckCircle2 class="h-12 w-12 text-green-600" />
			</div>

			<h2 class="mb-2 text-2xl font-bold text-gray-900">
				{title || 'Төлбөр амжилттай!'}
			</h2>

			<p class="mb-6 text-center text-gray-600">
				{message || 'Таны захиалга баталгаажлаа'}
			</p>

			{#if orderId}
				<div class="mb-6 w-full rounded-lg bg-gray-50 p-4">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Захиалгын дугаар</span>
						<span class="font-semibold text-gray-900">#{orderId}</span>
					</div>
					{#if amount}
						<div class="mt-2 flex items-center justify-between">
							<span class="text-sm text-gray-600">Төлсөн дүн</span>
							<span class="font-semibold text-gray-900">{amount}₮</span>
						</div>
					{/if}
				</div>
			{/if}

			<div class="flex w-full flex-col gap-3">
				{#if orderId}
					<button
						on:click={handleViewReceipt}
						class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50"
					>
						<Receipt class="h-5 w-5" />
						Баримт харах
					</button>

					<button
						on:click={handleViewOrder}
						class="w-full rounded-lg bg-red-600 py-3 font-medium text-white hover:bg-red-700"
					>
						Захиалга харах
					</button>
				{:else}
					<button
						on:click={closeModal}
						class="w-full rounded-lg bg-red-600 py-3 font-medium text-white hover:bg-red-700"
					>
						Ойлголоо
					</button>
				{/if}
			</div>
		{:else}
			<!-- Error State -->
			<div
				class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100"
			>
				<XCircle class="h-12 w-12 text-red-600" />
			</div>

			<h2 class="mb-2 text-2xl font-bold text-gray-900">
				{title || 'Төлбөр амжилтгүй'}
			</h2>

			<p class="mb-6 text-center text-gray-600">
				{message || 'Төлбөр төлөхөд алдаа гарлаа. Дахин оролдоно уу.'}
			</p>

			{#if orderId}
				<div class="mb-6 w-full rounded-lg bg-gray-50 p-4">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600">Захиалгын дугаар</span>
						<span class="font-semibold text-gray-900">#{orderId}</span>
					</div>
				</div>
			{/if}

			<div class="flex w-full flex-col gap-3">
				<button
					on:click={closeModal}
					class="w-full rounded-lg bg-red-600 py-3 font-medium text-white hover:bg-red-700"
				>
					Дахин оролдох
				</button>

				<button
					on:click={closeModal}
					class="w-full rounded-lg border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50"
				>
					Хаах
				</button>
			</div>
		{/if}
	</div>
</Modal>
