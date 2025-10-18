<script lang="ts">
	import type { Banner } from '$lib/types/banner';

	export let banners: Banner[];
</script>

<div class="space-y-3">
	{#each banners as banner}
		<div class="overflow-hidden rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-1">
			<img
				src={banner.image_url}
				alt="Promotional Banner"
				class="h-32 w-full rounded object-cover md:h-40"
				style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
			/>
		</div>
	{/each}
</div>