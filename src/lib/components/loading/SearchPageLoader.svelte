<script lang="ts">
	import { List, MapPin } from 'lucide-svelte';
</script>

<div class="container mx-auto max-w-[1200px] px-4 py-8">
	<!-- Header Section -->
	<div class="mb-6 flex items-center justify-between">
		<div class="h-8 w-32 animate-pulse rounded bg-gray-200"></div>

		<!-- View Toggle (Mobile) -->
		<div class="flex rounded-lg bg-neutral-100 p-1 lg:hidden">
			<div class="flex items-center gap-2 rounded-md px-3 py-2">
				<List size={16} class="text-gray-400" />
				<div class="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
			</div>
			<div class="flex items-center gap-2 rounded-md px-3 py-2">
				<MapPin size={16} class="text-gray-400" />
				<div class="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- List View -->
		<div class="lg:block">
			<!-- Filter/Sort Section -->
			<div class="mb-6">
				<div class="mb-4 flex flex-wrap gap-4">
					{#each Array(4) as _}
						<div class="h-9 w-20 animate-pulse rounded-full bg-gray-200 px-4"></div>
					{/each}
				</div>
				<div class="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
			</div>

			<!-- Search Results Grid -->
			<div
				class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2"
			>
				{#each Array(6) as _, cardIndex}
					<div
						class="flex min-h-[280px] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md sm:min-h-[300px]"
						style="animation-delay: {cardIndex * 100}ms"
					>
						<!-- Image Skeleton -->
						<div
							class="h-48 w-full animate-pulse rounded-t-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 sm:h-52"
						></div>

						<!-- Content Skeleton -->
						<div class="flex flex-1 flex-col justify-between px-4 py-2">
							<div class="space-y-2">
								<!-- Restaurant Name -->
								<div
									class="h-4 w-3/4 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
								></div>

								<!-- Hours and Status -->
								<div class="flex items-center gap-1.5">
									<div
										class="h-4 w-4 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
									></div>
									<div
										class="h-5 w-16 animate-pulse rounded-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
									></div>
									<div
										class="h-3 w-20 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
									></div>
								</div>

								<!-- Address -->
								<div class="flex items-start gap-1.5">
									<div
										class="mt-0.5 h-4 w-4 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
									></div>
									<div
										class="h-3 w-32 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
									></div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Map View -->
		<div class="lg:block" style="height: 716px;">
			<div class="sticky top-24 h-full">
				<div class="flex h-full animate-pulse items-center justify-center rounded-xl bg-gray-200">
					<div class="text-lg text-gray-400">Loading map...</div>
				</div>
			</div>
		</div>
	</div>
</div>
