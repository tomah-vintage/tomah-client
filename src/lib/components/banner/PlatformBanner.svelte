<script lang="ts">
	import { createPlatformBannersQuery } from '$lib/stores/bannerQuery';
	import { goto } from '$app/navigation';
	import type { PlatformBanner } from '$lib/types/banner';
	import BannerSkeleton from '$lib/components/loading/BannerSkeleton.svelte';
	import InfiniteCarousel from '$lib/components/common/InfiniteCarousel.svelte';

	const platformBannersQuery = createPlatformBannersQuery();

	function handleBannerClick(banner: PlatformBanner) {
		goto(`/restaurant/${banner.restaurant}`);
	}

	$: banners = $platformBannersQuery.data || [];
</script>

{#if banners.length > 0}
	<section class="platform-banners-wrapper">
		<InfiniteCarousel
			items={banners}
			aspectRatio="2600 / 649"
			showArrows={true}
			showDots={true}
			gap={0}
			itemsPerView={1}
			autoPlay={true}
			autoPlayInterval={4000}
			let:item={banner}
		>
			<div
				class="banner-content"
				role="button"
				tabindex="0"
				on:click={() => handleBannerClick(banner)}
				on:keydown={(e) => e.key === 'Enter' && handleBannerClick(banner)}
			>
				<img src={banner.image_url} alt="Platform banner" loading="lazy" draggable="false" />
			</div>
		</InfiniteCarousel>
	</section>
{:else if $platformBannersQuery.isLoading}
	<BannerSkeleton />
{:else if $platformBannersQuery.error}
	<div class="platform-banners-error">Error: {$platformBannersQuery.error.message}</div>
{/if}

<style>
	.platform-banners-wrapper {
		margin: 1rem 0;
		width: 100vw;
		position: relative;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
	}

	.banner-content {
		width: 100%;
		height: 100%;
		min-height: 280px;
		cursor: pointer;
		transition: transform 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.banner-content img {
		width: 100%;
		height: 100%;
		min-height: 280px;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	@media (min-width: 768px) {
		.banner-content {
			min-height: 320px;
		}

		.banner-content img {
			min-height: 320px;
		}
	}

	@media (min-width: 1024px) {
		.banner-content {
			min-height: 380px;
		}

		.banner-content img {
			min-height: 380px;
		}
	}

	.banner-content:hover img {
		transform: scale(1.05);
	}

	.platform-banners-error {
		padding: 1rem;
		text-align: center;
		border-radius: 8px;
		margin: 1rem 0;
		background-color: #fef2f2;
		color: #dc2626;
	}
</style>
