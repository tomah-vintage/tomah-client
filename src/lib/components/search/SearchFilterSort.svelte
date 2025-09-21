<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { SearchQuery } from '$lib/types/search';
    import { Coffee, Utensils, Cake, Pizza, Salad, Fish } from 'lucide-svelte';
	import { createCategoriesQuery } from '$lib/stores/categoriesQuery';

	const dispatch = createEventDispatcher<{ change: Partial<SearchQuery> }>();

	let selectedCategory: string | null = null;

	const categoriesQuery = createCategoriesQuery();
	$: ({ data: apiCategories, isLoading: categoriesLoading, isError: categoriesError } = $categoriesQuery);

	const fallbackCategories = [
		{ name: 'Өглөөний цай', icon: Coffee, value: 'breakfast' },
		{ name: 'Өдрийн хоол', icon: Utensils, value: 'lunch' },
		{ name: 'Амттан', icon: Cake, value: 'dessert' },
		{ name: 'Түргэн хоол', icon: Pizza, value: 'fast_food' },
		{ name: 'Эрүүл хоол', icon: Salad, value: 'healthy' },
		{ name: 'Сүши', icon: Fish, value: 'sushi' }
	];

	const iconMap: Record<string, any> = {
		'breakfast': Coffee,
		'өглөөний цай': Coffee,
		'lunch': Utensils,
		'өдрийн хоол': Utensils,
		'dessert': Cake,
		'амттан': Cake,
		'fast_food': Pizza,
		'түргэн хоол': Pizza,
		'healthy': Salad,
		'эрүүл хоол': Salad,
		'sushi': Fish,
		'сүши': Fish
	};

	$: showLoading = categoriesLoading && !apiCategories;
	$: categories = apiCategories && apiCategories.length > 0 
		? apiCategories
			.filter(cat => cat.is_active)
			.map(cat => ({
				name: cat.mongolian_name || cat.name,
				icon: iconMap[cat.name.toLowerCase()] || Utensils,
				image_url: cat.image_url,
				value: cat.name.toLowerCase().replace(/\s+/g, '_')
			}))
		: fallbackCategories;

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
		{#if showLoading}
			{#each Array(4) as _}
				<div class="flex flex-col items-center justify-between text-center p-3 rounded-lg w-24 h-24 bg-gray-100 animate-pulse">
					<div class="w-8 h-8 bg-gray-200 rounded"></div>
					<div class="w-12 h-3 bg-gray-200 rounded"></div>
				</div>
			{/each}
		{:else}
			{#each categories as category}
				<button
					on:click={() => selectCategory(category.value)}
					class="flex flex-col items-center justify-between text-center p-3 rounded-lg transition-colors duration-200 w-24 h-24 {selectedCategory === category.value
						? 'bg-orange-500 text-white'
						: 'bg-gray-100 hover:bg-gray-200'}"
				>
					<div class="w-8 h-8 flex items-center justify-center">
						{#if category.image_url}
							<img 
								src={category.image_url} 
								alt={category.name}
								class="w-8 h-8 object-cover rounded"
								loading="lazy"
							/>
						{:else}
							<svelte:component this={category.icon} size={32} />
						{/if}
					</div>
					<span class="text-xs font-medium leading-tight">{category.name}</span>
				</button>
			{/each}
		{/if}
	</div>
</div>