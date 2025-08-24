<script lang="ts">
	import type { MenuCategory } from '$lib/types/menu';

	export let categories: MenuCategory[];
	export let selectedCategoryId: string;
	export let searchTerm = '';

	function selectCategory(categoryId: string) {
		selectedCategoryId = categoryId;
	}
</script>

<div class="mt-10">
	<div class="mb-5 flex justify-between">
		<div>
			<p class="text-lg font-semibold">Меню</p>
			<p class="text-sm text-slate-400">10:00 өглөө-21:30 орой</p>
		</div>
		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Search..."
			class="rounded-lg border p-2 w-xl"
		/>
	</div>
	<div class="flex items-center justify-between border-b border-slate-300">
		<div class="flex space-x-4">
			{#each categories as category}
				<button
					class="px-4 py-2 font-semibold text-[#222222]"
					class:border-b-2={selectedCategoryId === category.id}
					class:border-red-500={selectedCategoryId === category.id}
					on:click={() => selectCategory(category.id)}
				>
					{category.name}
				</button>
			{/each}
		</div>
	</div>
</div>
