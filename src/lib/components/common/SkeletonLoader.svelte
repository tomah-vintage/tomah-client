<script lang="ts">
	export let type: 'carousel' | 'list' = 'list';
</script>

{#if type === 'carousel'}
	<div class="mb-8 h-64 animate-pulse rounded-lg bg-gray-200"></div>
{:else if type === 'list'}
	<div class="container mx-auto px-4 py-8">
		<!-- Section 1 Skeleton -->
		<div class="mb-8">
			<div class="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
			<!-- Section Title -->
			<div class="flex space-x-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="w-64 flex-none animate-pulse rounded-lg bg-gray-200 p-4">
						<div class="mb-2 h-32 rounded bg-gray-300"></div>
						<!-- Card Image (h-32 from RestaurantCard) -->
						<div class="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
						<!-- Card Title -->
						<div class="mb-1 h-3 w-1/2 rounded bg-gray-300"></div>
						<!-- Card Detail 1 -->
						<div class="h-3 w-2/3 rounded bg-gray-300"></div>
						<!-- Card Detail 2 -->
					</div>
				{/each}
			</div>
		</div>

		<!-- Section 2 Skeleton -->
		<div class="mb-8">
			<div class="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
			<!-- Section Title -->
			<div class="flex space-x-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="w-64 flex-none animate-pulse rounded-lg bg-gray-200 p-4">
						<div class="mb-2 h-32 rounded bg-gray-300"></div>
						<!-- Card Image -->
						<div class="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
						<!-- Card Title -->
						<div class="mb-1 h-3 w-1/2 rounded bg-gray-300"></div>
						<!-- Card Detail 1 -->
						<div class="h-3 w-2/3 rounded bg-gray-300"></div>
						<!-- Card Detail 2 -->
					</div>
				{/each}
			</div>
		</div>

		<!-- Section 3 Skeleton -->
		<div class="mb-8">
			<div class="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
			<!-- Section Title -->
			<div class="flex space-x-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="w-64 flex-none animate-pulse rounded-lg bg-gray-200 p-4">
						<div class="mb-2 h-32 rounded bg-gray-300"></div>
						<!-- Card Image -->
						<div class="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
						<!-- Card Title -->
						<div class="mb-1 h-3 w-1/2 rounded bg-gray-300"></div>
						<!-- Card Detail 1 -->
						<div class="h-3 w-2/3 rounded bg-gray-300"></div>
						<!-- Card Detail 2 -->
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
