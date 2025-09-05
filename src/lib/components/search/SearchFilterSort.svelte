<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { SearchQuery } from '$lib/types/search';
    import { Coffee, Utensils, Cake, Pizza, Salad, Fish } from 'lucide-svelte';

	const dispatch = createEventDispatcher<{ change: Partial<SearchQuery> }>();

	let selectedCategory: string | null = null;

	const categories = [
		{ name: 'Өглөөний цай', icon: Coffee, value: 'breakfast' },
		{ name: 'Өдрийн хоол', icon: Utensils, value: 'lunch' },
		{ name: 'Амттан', icon: Cake, value: 'dessert' },
		{ name: 'Түргэн хоол', icon: Pizza, value: 'fast_food' },
		{ name: 'Эрүүл хоол', icon: Salad, value: 'healthy' },
		{ name: 'Сүши', icon: Fish, value: 'sushi' }
	];

	function selectCategory(categoryValue: string) {
		if (selectedCategory === categoryValue) {
			selectedCategory = null; // Deselect if clicked again
		} else {
			selectedCategory = categoryValue;
		}

		const newFilters: Record<string, string> = {};
		if (selectedCategory) {
			newFilters.category = selectedCategory;
		}
		dispatch('change', {
			filters: newFilters
		});
	}
</script>

<div class="mb-6">
	<h2 class="text-xl font-semibold mb-3">Хоолны төрөл</h2>
	<div class="flex space-x-3 overflow-x-auto pb-2">
		{#each categories as category}
			<button
				on:click={() => selectCategory(category.value)}
				class="flex flex-col items-center justify-center text-center p-3 rounded-lg transition-colors duration-200 w-24 h-24 {selectedCategory === category.value
					? 'bg-orange-500 text-white'
					: 'bg-gray-100 hover:bg-gray-200'}"
			>
				<div class="w-8 h-8 mb-1">
                    <svelte:component this={category.icon} size={32} />
                </div>
				<span class="text-xs font-medium">{category.name}</span>
			</button>
		{/each}
	</div>
</div>