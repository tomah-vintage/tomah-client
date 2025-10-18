<script lang="ts">
	import type { Banner } from '$lib/types/banner';

	export let banners: Banner[];
</script>

<div class="grid gap-4 {banners.length === 1 ? 'grid-cols-1' : banners.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}">
	{#each banners as banner}
		<div class="overflow-hidden rounded-lg">
			<img
				src={banner.image_url}
				alt="Featured Banner"
				class="h-48 w-full object-cover transition-transform hover:scale-105"
				style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
			/>
		</div>
	{/each}
</div>