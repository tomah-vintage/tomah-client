<script lang="ts">
	import { createRestaurantBannersQuery } from '$lib/stores/bannerQuery';
	import type { Banner } from '$lib/types/banner';
	import HeroBanner from './HeroBanner.svelte';
	import CarouselBanner from './CarouselBanner.svelte';
	import FeaturedBanner from './FeaturedBanner.svelte';
	import PromotionalBanner from './PromotionalBanner.svelte';
	import MagazineBanner from './MagazineBanner.svelte';

	export let restaurantId: number;

	$: bannersQuery = createRestaurantBannersQuery(restaurantId);
	$: ({ data, isLoading: loading, error } = $bannersQuery);
	$: allBanners = (data as any)?.results || (data as Banner[]) || [];
	
	// Group banners by layout type and position
	$: groupedBanners = allBanners.reduce((acc: Record<string, Banner[]>, banner: Banner) => {
		const key = `${banner.layout_type}_${banner.position}`;
		if (!acc[key]) acc[key] = [];
		acc[key].push(banner);
		return acc;
	}, {});
	
	// Sort banners within each group by order_index
	$: Object.values(groupedBanners).forEach((group) => {
		(group as Banner[]).sort((a: Banner, b: Banner) => a.order_index - b.order_index);
	});

</script>

{#if loading}
	<div class="flex h-64 items-center justify-center bg-gray-200 rounded-lg">
		<div class="text-gray-500">Loading restaurant banners...</div>
	</div>
{:else if error}
	<div class="flex h-32 items-center justify-center bg-red-50 border border-red-200 rounded-lg">
		<div class="text-red-600">Error loading banners: {error.message}</div>
	</div>
{:else if (allBanners as Banner[]).length === 0}
	<div class="flex h-32 items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg">
		<div class="text-yellow-600">No banners found for restaurant {restaurantId}</div>
	</div>
{:else}
	<div class="space-y-6">
		<!-- TOP Position Banners -->
		{#each Object.entries(groupedBanners) as [key, banners]}
			{@const [layoutType, position] = key.split('_')}
			{@const typedBanners = banners as Banner[]}
			{#if position === 'TOP'}
				<div class="banner-section">
					{#if layoutType === 'HERO'}
						{#if typedBanners.length > 1}
							<CarouselBanner banners={typedBanners} />
						{:else}
							<HeroBanner banner={typedBanners[0]} />
						{/if}
					{:else if layoutType === 'CAROUSEL'}
						<CarouselBanner banners={typedBanners} />
					{:else if layoutType === 'FEATURED'}
						<FeaturedBanner banners={typedBanners} />
					{:else if layoutType === 'PROMOTIONAL'}
						<PromotionalBanner banners={typedBanners} />
					{:else if layoutType === 'Magazine'}
						<MagazineBanner banners={typedBanners} />
					{/if}
				</div>
			{/if}
		{/each}
		
		<!-- MIDDLE Position Banners -->
		{#each Object.entries(groupedBanners) as [key, banners]}
			{@const [layoutType, position] = key.split('_')}
			{@const typedBanners = banners as Banner[]}
			{#if position === 'MIDDLE'}
				<div class="banner-section">
					{#if layoutType === 'HERO'}
						{#if typedBanners.length > 1}
							<CarouselBanner banners={typedBanners} />
						{:else}
							<HeroBanner banner={typedBanners[0]} />
						{/if}
					{:else if layoutType === 'CAROUSEL'}
						<CarouselBanner banners={typedBanners} />
					{:else if layoutType === 'FEATURED'}
						<FeaturedBanner banners={typedBanners} />
					{:else if layoutType === 'PROMOTIONAL'}
						<PromotionalBanner banners={typedBanners} />
					{:else if layoutType === 'Magazine'}
						<MagazineBanner banners={typedBanners} />
					{/if}
				</div>
			{/if}
		{/each}
		
		<!-- BOTTOM Position Banners -->
		{#each Object.entries(groupedBanners) as [key, banners]}
			{@const [layoutType, position] = key.split('_')}
			{@const typedBanners = banners as Banner[]}
			{#if position === 'BOTTOM'}
				<div class="banner-section">
					{#if layoutType === 'HERO'}
						{#if typedBanners.length > 1}
							<CarouselBanner banners={typedBanners} />
						{:else}
							<HeroBanner banner={typedBanners[0]} />
						{/if}
					{:else if layoutType === 'CAROUSEL'}
						<CarouselBanner banners={typedBanners} />
					{:else if layoutType === 'FEATURED'}
						<FeaturedBanner banners={typedBanners} />
					{:else if layoutType === 'PROMOTIONAL'}
						<PromotionalBanner banners={typedBanners} />
					{:else if layoutType === 'Magazine'}
						<MagazineBanner banners={typedBanners} />
					{/if}
				</div>
			{/if}
		{/each}
		
		<!-- SIDEBAR Position Banners -->
		{#each Object.entries(groupedBanners) as [key, banners]}
			{@const [layoutType, position] = key.split('_')}
			{@const typedBanners = banners as Banner[]}
			{#if position === 'SIDEBAR'}
				<div class="banner-section">
					{#if layoutType === 'HERO'}
						{#if typedBanners.length > 1}
							<CarouselBanner banners={typedBanners} />
						{:else}
							<HeroBanner banner={typedBanners[0]} />
						{/if}
					{:else if layoutType === 'CAROUSEL'}
						<CarouselBanner banners={typedBanners} />
					{:else if layoutType === 'FEATURED'}
						<FeaturedBanner banners={typedBanners} />
					{:else if layoutType === 'PROMOTIONAL'}
						<PromotionalBanner banners={typedBanners} />
					{:else if layoutType === 'Magazine'}
						<MagazineBanner banners={typedBanners} />
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{/if}

