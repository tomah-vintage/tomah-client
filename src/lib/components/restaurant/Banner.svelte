<script lang="ts">
	import { onMount } from 'svelte';
	import type { Banner } from '$lib/types/banner';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	export let restaurantId: number;

	let banners: Banner[] = [];
	let loading = true;
	onMount(async () => {
		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/api/banner/?restaurant=${restaurantId}`);
			const data = await response.json();
			banners = (data.results || data).filter((banner: Banner) => banner.position === 'TOP');
		} catch (error) {
			console.error('Failed to load banners:', error);
			banners = [];
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="flex h-64 items-center justify-center bg-gray-200">
		<div class="text-gray-500">Loading banners...</div>
	</div>
{:else if banners.length > 0}
	<div class="space-y-4">
		{#each banners as banner}
			<div class="overflow-hidden rounded-lg">
				<img
					src={banner.image_url}
					alt="Restaurant Banner"
					class="h-64 w-full object-cover md:h-80 lg:h-96"
					style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
				/>
			</div>
		{/each}
	</div>
{:else}
	<!-- Fallback when no banners -->
	<div class="flex h-64 items-center justify-center rounded-lg bg-gray-100">
		<div class="text-gray-500">No banners available</div>
	</div>
{/if}

