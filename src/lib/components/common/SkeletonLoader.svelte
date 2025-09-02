<script lang="ts">
	export let type: 'carousel' | 'list' = 'list';
</script>

{#if type === 'carousel'}
	<div class="h-64 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
{:else if type === 'list'}
	<div class="container mx-auto px-4 py-8">
		<!-- Section 1 Skeleton -->
		<div class="mb-8">
			<div class="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div> <!-- Section Title -->
			<div class="flex space-x-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="flex-none w-64 bg-gray-200 rounded-lg animate-pulse p-4">
						<div class="h-32 bg-gray-300 rounded mb-2"></div> <!-- Card Image (h-32 from RestaurantCard) -->
						<div class="h-4 w-3/4 bg-gray-300 rounded mb-2"></div> <!-- Card Title -->
						<div class="h-3 w-1/2 bg-gray-300 rounded mb-1"></div> <!-- Card Detail 1 -->
						<div class="h-3 w-2/3 bg-gray-300 rounded"></div> <!-- Card Detail 2 -->
					</div>
				{/each}
			</div>
		</div>

		<!-- Section 2 Skeleton -->
		<div class="mb-8">
			<div class="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div> <!-- Section Title -->
			<div class="flex space-x-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="flex-none w-64 bg-gray-200 rounded-lg animate-pulse p-4">
						<div class="h-32 bg-gray-300 rounded mb-2"></div> <!-- Card Image -->
						<div class="h-4 w-3/4 bg-gray-300 rounded mb-2"></div> <!-- Card Title -->
						<div class="h-3 w-1/2 bg-gray-300 rounded mb-1"></div> <!-- Card Detail 1 -->
						<div class="h-3 w-2/3 bg-gray-300 rounded"></div> <!-- Card Detail 2 -->
					</div>
				{/each}
			</div>
		</div>

		<!-- Section 3 Skeleton -->
		<div class="mb-8">
			<div class="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div> <!-- Section Title -->
			<div class="flex space-x-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="flex-none w-64 bg-gray-200 rounded-lg animate-pulse p-4">
						<div class="h-32 bg-gray-300 rounded mb-2"></div> <!-- Card Image -->
						<div class="h-4 w-3/4 bg-gray-300 rounded mb-2"></div> <!-- Card Title -->
						<div class="h-3 w-1/2 bg-gray-300 rounded mb-1"></div> <!-- Card Detail 1 -->
						<div class="h-3 w-2/3 bg-gray-300 rounded"></div> <!-- Card Detail 2 -->
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
