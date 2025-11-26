<script lang="ts">
	export let type: 'carousel' | 'list' = 'list';
</script>

{#if type === 'carousel'}
	<!-- RestaurantCarousel Skeleton -->
	<div class="relative w-full overflow-hidden">
		<div class="flex gap-6">
			{#each Array(3) as _, i}
				<div
					class="mb-5 ml-1 flex h-[248px] w-[300px] flex-none flex-col overflow-hidden rounded-2xl bg-white shadow-md"
					style="animation-delay: {i * 100}ms"
				>
					<!-- Image Skeleton -->
					<div
						class="h-[152px] w-full animate-pulse rounded-t-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
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
{:else if type === 'list'}
	<!-- RestaurantMain Skeleton -->
	<div class="flex flex-col gap-4.5">
		{#each Array(4) as _, sectionIndex}
			<div class="mb-6">
				<!-- Section Title -->
				<div class="mb-4 flex justify-between">
					<div
						class="h-7 w-48 animate-pulse rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
					></div>
				</div>

				<!-- Carousel Cards -->
				<div class="flex gap-6 overflow-hidden">
					{#each Array(4) as _, cardIndex}
						<div
							class="mb-5 ml-1 flex h-[248px] w-[300px] flex-none flex-col overflow-hidden rounded-2xl bg-white shadow-md"
							style="animation-delay: {(sectionIndex * 4 + cardIndex) * 100}ms"
						>
							<!-- Image Skeleton -->
							<div
								class="h-[152px] w-full animate-pulse rounded-t-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
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
		{/each}
	</div>
{/if}
