<script lang="ts">
	export let images: string[] = [];
</script>

<div class="w-full">
	{#if images.length === 1}
		<!-- Single image full width -->
		<div class="h-[400px] w-full">
			<img src={images[0]} alt="Restaurant" class="h-[400px] w-full rounded-lg object-cover" />
		</div>
	{:else if images.length === 2}
		<!-- Two images side by side -->
		<div class="grid h-[400px] grid-cols-2 gap-2">
			{#each images as img}
				<img src={img} alt="Restaurant" class="h-[400px] w-full rounded-lg object-cover" />
			{/each}
		</div>
	{:else if images.length >= 3}
		<!-- Layout with 3+ images (like screenshot) -->
		<div class="grid h-[400px] grid-cols-3 gap-2">
			<!-- Main image -->
			<div class="col-span-2 h-full">
				<img
					src={images[0]}
					alt="Main restaurant"
					class="h-[408px] w-full rounded-lg object-cover"
				/>
			</div>

			<!-- Two stacked side images -->
			<div class="flex h-[400px] flex-col gap-2">
				<img src={images[1]} alt="Restaurant side 1" class="h-1/2 w-full rounded-lg object-cover" />
				<img src={images[2]} alt="Restaurant side 2" class="h-1/2 w-full rounded-lg object-cover" />
			</div>
		</div>
	{/if}
</div>
