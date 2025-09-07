<script lang="ts">
	export let type: 'carousel' | 'list' = 'list';
</script>

{#if type === 'carousel'}
	<!-- RestaurantCarousel Skeleton -->
	<div class="relative w-full overflow-hidden">
		<div class="flex gap-6">
			{#each Array(3) as _, i}
				<div 
					class="w-[386px] h-[249px] flex-none rounded-lg bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"
					style="animation-delay: {i * 200}ms"
				></div>
			{/each}
		</div>
	</div>
{:else if type === 'list'}
	<!-- RestaurantMain Skeleton -->
	<div class="flex flex-col gap-4.5">
		{#each Array(4) as _, sectionIndex}
			<div class="mb-2">
				<!-- Section Title -->
				<div class="mb-2 flex justify-between">
					<div class="h-7 w-48 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"></div>
				</div>
				
				<!-- Carousel Cards -->
				<div class="flex gap-6 overflow-hidden">
					{#each Array(4) as _, cardIndex}
						<div 
							class="relative w-[300px] h-[248px] flex-none rounded-2xl bg-white shadow-[0_11px_3px_0_rgba(0,0,0,0.00),_0_0_10.2px_0_rgba(0,0,0,0.10)]"
							style="animation-delay: {(sectionIndex * 4 + cardIndex) * 100}ms"
						>
							<!-- Image Skeleton -->
							<div class="h-[152px] w-full rounded-t-2xl bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"></div>
							
							<!-- Content Skeleton -->
							<div class="flex flex-col gap-1 py-3.5 pl-5">
								<!-- Restaurant Name -->
								<div class="h-4 w-3/4 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"></div>
								
								<!-- Opening Hours -->
								<div class="flex items-center gap-1 mt-1">
									<div class="h-4 w-4 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"></div>
									<div class="h-3 w-20 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"></div>
								</div>
								
								<!-- Address -->
								<div class="flex items-center gap-1 mt-1">
									<div class="h-4 w-4 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"></div>
									<div class="h-3 w-32 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer bg-[length:200%_100%]"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}
