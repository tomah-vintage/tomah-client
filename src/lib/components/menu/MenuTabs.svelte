<script lang="ts">
	import { onMount } from 'svelte';
	import type { MenuCategory } from '$lib/types/menu';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	export let restaurantId: number;
	export let selectedCategoryId: string;
	export let searchTerm = '';

	let categories: MenuCategory[] = [];
	let loading = true;

	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/api/item-category/?restaurant=${restaurantId}`);
			const data = await response.json();
			categories = data.results || data;
			
			if (categories.length > 0 && !selectedCategoryId) {
				selectedCategoryId = categories[0].id;
			}
		} catch (error) {
			console.error('Failed to load categories:', error);
			categories = [];
		} finally {
			loading = false;
		}
	});

	function selectCategory(categoryId: string) {
		selectedCategoryId = categoryId;
	}
</script>

<div class="mt-10">
	<div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">Меню</h2>
			<p class="text-sm text-gray-500">10:00 өглөө-21:30 орой</p>
		</div>
		<div class="relative w-full max-w-sm">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Хайх..."
				class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all duration-200"
			/>
			{#if searchTerm}
				<button
					on:click={() => (searchTerm = '')}
					aria-label="Clear search"
					class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
	<div class="border-b border-gray-200">
		<div class="flex overflow-x-auto scrollbar-hide">
			<div class="flex space-x-1 min-w-full">
				{#if loading}
					<div class="px-6 py-3 text-gray-400 animate-pulse">Loading...</div>
				{:else if categories.length < 1}
					<div class="px-6 py-3 font-semibold text-gray-900 border-b-2 border-red-500">
						Үндсэн хоол
					</div>
				{:else}
					{#each categories as category}
						<button
							class="whitespace-nowrap px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 relative"
							class:text-red-600={selectedCategoryId === category.id}
							class:font-semibold={selectedCategoryId === category.id}
							on:click={() => selectCategory(category.id)}
						>
							{category.name}
							{#if selectedCategoryId === category.id}
								<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"></div>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
