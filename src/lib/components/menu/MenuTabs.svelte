<script lang="ts">
	import type { MenuCategory } from '$lib/types/menu';

	export let categories: MenuCategory[];
	export let selectedCategoryId: string;
	export let searchTerm = '';

	function selectCategory(categoryId: string) {
		selectedCategoryId = categoryId;
	}
</script>

<div class="flex items-center justify-between border-b">
	<div class="flex space-x-4">
		{#each categories as category}
			<button
				class="px-4 py-2 font-semibold"
				class:border-b-2={selectedCategoryId === category.id}
				class:border-blue-500={selectedCategoryId === category.id}
				on:click={() => selectCategory(category.id)}
			>
				{category.name}
			</button>
		{/each}
	</div>
	<input
		type="text"
		bind:value={searchTerm}
		placeholder="Search..."
		class="rounded-md border p-2"
	/>
</div>
