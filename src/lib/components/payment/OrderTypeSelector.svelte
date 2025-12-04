<script lang="ts">
	import { currentTable } from '$lib/stores/table';

	export let orderType: 'TAKE_OUT' | 'DINE_IN';
	export let hasTable = false;

	function handleOrderTypeChange(newType: 'TAKE_OUT' | 'DINE_IN') {
		orderType = newType;
	}
</script>

<div class="mb-3 rounded-lg border border-gray-200 p-3 lg:mb-4 lg:p-4">
	<p class="mb-3 text-sm font-semibold lg:mb-4 lg:text-base">Захиалгын төрөл</p>
	<div class="space-y-3">
		<!-- Take Out option - always shown -->
		<div
			class="cursor-pointer rounded-lg border-2 p-3 transition-all {orderType === 'TAKE_OUT'
				? 'border-red-500 bg-red-50'
				: 'border-gray-200 hover:bg-gray-50'}"
			on:click={() => handleOrderTypeChange('TAKE_OUT')}
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'Enter' && handleOrderTypeChange('TAKE_OUT')}
		>
			<div class="flex items-start gap-3">
				<input type="radio" bind:group={orderType} value="TAKE_OUT" class="mt-0.5" />
				<div class="flex-1">
					<div class="font-medium text-gray-900">Авч явах</div>
					<div class="mt-0.5 text-sm text-gray-500">
						Сав баглаа болон хүргэлтийн төлбөр тусгагдана
					</div>
				</div>
			</div>
		</div>

		<!-- Dine In option - only shown when hasTable is true -->
		{#if hasTable}
			<div
				class="cursor-pointer rounded-lg border-2 p-3 transition-all {orderType === 'DINE_IN'
					? 'border-red-500 bg-red-50'
					: 'border-gray-200 hover:bg-gray-50'}"
				on:click={() => handleOrderTypeChange('DINE_IN')}
				role="button"
				tabindex="0"
				on:keydown={(e) => e.key === 'Enter' && handleOrderTypeChange('DINE_IN')}
			>
				<div class="flex items-start gap-3">
					<input type="radio" bind:group={orderType} value="DINE_IN" class="mt-0.5" />
					<div class="flex-1">
						<div class="font-medium text-gray-900">Ширээний дээр идэх</div>
						<div class="mt-0.5 text-sm text-gray-500">
							Ширээ #{$currentTable?.id}-д захиалга хүлээн авна. Сав баглааны төлбөр байхгүй.
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if orderType === 'DINE_IN' && hasTable}
		<div class="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-2">
			<div class="flex items-center gap-2">
				<div class="h-2 w-2 rounded-full bg-blue-500"></div>
				<div class="text-sm font-medium text-blue-700">
					Таны захиалга ширээ #{$currentTable?.id}-д хүргэгдэнэ
				</div>
			</div>
		</div>
	{/if}
</div>
