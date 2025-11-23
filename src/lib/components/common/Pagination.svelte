<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let currentPage: number = 1;
	export let totalPages: number = 1;
	export let totalCount: number = 0;
	export let pageSize: number = 10;

	const dispatch = createEventDispatcher<{
		pageChange: { page: number };
	}>();

	$: startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	$: endItem = Math.min(currentPage * pageSize, totalCount);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			dispatch('pageChange', { page });
		}
	}

	function getPageNumbers(): (number | string)[] {
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage > 3) {
				pages.push('...');
			}

			// Show pages around current page
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push('...');
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	}

	$: pageNumbers = getPageNumbers();
</script>

<div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
	<!-- Mobile View -->
	<div class="flex flex-1 justify-between sm:hidden">
		<button
			on:click={() => goToPage(currentPage - 1)}
			disabled={currentPage === 1}
			class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Өмнөх
		</button>
		<button
			on:click={() => goToPage(currentPage + 1)}
			disabled={currentPage === totalPages}
			class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Дараах
		</button>
	</div>

	<!-- Desktop View -->
	<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
		<div>
			<p class="text-sm text-gray-700">
				<span class="font-medium">{startItem}</span>
				-
				<span class="font-medium">{endItem}</span>
				-ийн
				<span class="font-medium">{totalCount}</span>
				үр дүн
			</p>
		</div>
		<div>
			<nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
				<!-- Previous Button -->
				<button
					on:click={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span class="sr-only">Өмнөх</span>
					<ChevronLeft class="h-5 w-5" />
				</button>

				<!-- Page Numbers -->
				{#each pageNumbers as pageNum}
					{#if pageNum === '...'}
						<span
							class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
						>
							...
						</span>
					{:else}
						<button
							on:click={() => goToPage(pageNum as number)}
							class="relative inline-flex items-center border px-4 py-2 text-sm font-medium {currentPage ===
							pageNum
								? 'z-10 border-red-500 bg-red-50 text-red-600'
								: 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}"
						>
							{pageNum}
						</button>
					{/if}
				{/each}

				<!-- Next Button -->
				<button
					on:click={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span class="sr-only">Дараах</span>
					<ChevronRight class="h-5 w-5" />
				</button>
			</nav>
		</div>
	</div>
</div>
