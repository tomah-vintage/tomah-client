<script lang="ts">
	import type { Banner } from '$lib/types/banner';

	export let banners: Banner[] = [];
</script>

{#if banners.length === 0}
	<div class="flex h-32 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
		<div class="text-gray-500">No banners to display.</div>
	</div>
{:else}
	<div class="mb-8 space-y-4">
		{#each banners as banner (banner.id)}
			<div class="overflow-hidden rounded-lg">
				<img
					src={banner.image_url}
					alt="Main Banner"
					class="h-64 w-full object-cover md:h-80 lg:h-96"
					style={banner.width && banner.height
						? `aspect-ratio: ${banner.width}/${banner.height}`
						: ''}
				/>
			</div>
		{/each}
	</div>
{/if}
