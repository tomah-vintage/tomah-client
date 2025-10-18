<script lang="ts">
	import type { Banner } from '$lib/types/banner';

	export let banners: Banner[];
</script>

<div class="grid gap-6 md:grid-cols-2">
	{#each banners as banner}
		<div class="overflow-hidden rounded-lg shadow-lg">
			<img
				src={banner.image_url}
				alt="Magazine Style Banner"
				class="h-64 w-full object-cover"
				style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
			/>
		</div>
	{/each}
</div>