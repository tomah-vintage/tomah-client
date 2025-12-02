<script lang="ts">
	import { Package } from 'lucide-svelte';

	export let isChecked: boolean = false;
	export let containerPrice: number = 2000;
	export let quantity: number = 1;
	export let onToggle: (checked: boolean) => void;

	$: totalFee = quantity * containerPrice;

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onToggle(target.checked);
	}
</script>

<div class="flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-2">
	<label class="flex flex-1 cursor-pointer items-center gap-2">
		<input
			type="checkbox"
			checked={isChecked}
			on:change={handleChange}
			class="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-2 focus:ring-red-500"
		/>
		<Package class="h-4 w-4 text-gray-600" />
		<span class="text-sm font-medium text-gray-700">Авч явах</span>
	</label>
	{#if isChecked}
		<span class="text-sm font-medium text-red-600">+{totalFee.toLocaleString()}₮</span>
	{/if}
</div>
