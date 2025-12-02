<script lang="ts">
	export let cartTotal: number;
	export let discount: number;
	export let packagingFee: number;
	export let finalAmount: number;
</script>

<div class="mb-3 rounded-lg border border-gray-200 p-3 lg:mb-4 lg:p-4">
	<p class="mb-2 text-sm font-semibold lg:text-base">Төлбөрийн дэлгэрэнгүй</p>

	<div class="flex justify-between text-sm">
		<span>Нийт дүн:</span>
		<span>{cartTotal.toLocaleString()}₮</span>
	</div>

	<div class="flex justify-between text-sm">
		<span>Хямдрал:</span>
		<span>-{discount.toLocaleString()}₮</span>
	</div>

	{#if packagingFee > 0}
		<div class="flex justify-between text-sm">
			<span>Савны төлбөр:</span>
			<span>{packagingFee.toLocaleString()}₮</span>
		</div>
	{/if}

	<div class="mt-2 flex justify-between text-lg font-bold">
		<span>Төлөх дүн:</span>
		<span>{finalAmount.toLocaleString()}₮</span>
	</div>
</div>
