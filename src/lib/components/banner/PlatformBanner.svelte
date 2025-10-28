<script lang="ts">
	import { createPlatformBannersQuery } from '$lib/stores/bannerQuery';
	import { goto } from '$app/navigation';
	import type { PlatformBanner } from '$lib/types/banner';
	import { onMount } from 'svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import BannerSkeleton from '$lib/components/loading/BannerSkeleton.svelte';

	const platformBannersQuery = createPlatformBannersQuery();
	let carouselContainer: HTMLElement;
	let currentIndex = 0;
	let isDesktop = false;

	function handleBannerClick(banner: PlatformBanner) {
		goto(`/restaurant/${banner.restaurant}`);
	}

	function handleScroll() {
		if (!carouselContainer || !banners.length) return;
		
		if (isDesktop) {
			const containerWidth = carouselContainer.offsetWidth;
			const scrollLeft = carouselContainer.scrollLeft;
			const newIndex = Math.round(scrollLeft / containerWidth);
			currentIndex = newIndex;
		} else {
			const scrollLeft = carouselContainer.scrollLeft;
			const itemWidth = carouselContainer.scrollWidth / banners.length;
			currentIndex = Math.round(scrollLeft / itemWidth);
		}
	}

	function goToSlide(index: number) {
		if (!carouselContainer || !banners.length) return;
		
		if (isDesktop) {
			const containerWidth = carouselContainer.offsetWidth;
			const scrollPosition = index * containerWidth;
			carouselContainer.scrollTo({
				left: Math.min(scrollPosition, carouselContainer.scrollWidth - carouselContainer.offsetWidth),
				behavior: 'smooth'
			});
		} else {
			const itemWidth = carouselContainer.scrollWidth / banners.length;
			carouselContainer.scrollTo({
				left: index * itemWidth,
				behavior: 'smooth'
			});
		}
	}

	function nextSlide() {
		if (!banners.length || !carouselContainer) return;
		
		if (isDesktop) {
			const newScrollPosition = carouselContainer.scrollLeft - carouselContainer.offsetWidth;
			
			if (newScrollPosition <= 0) {
				const maxScroll = carouselContainer.scrollWidth - carouselContainer.offsetWidth;
				carouselContainer.scrollTo({ left: maxScroll, behavior: 'smooth' });
				currentIndex = Math.ceil(banners.length / 3) - 1;
			} else {
				carouselContainer.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
				currentIndex = Math.round(newScrollPosition / carouselContainer.offsetWidth);
			}
		} else {
			const nextIndex = currentIndex >= banners.length - 1 ? 0 : currentIndex + 1;
			currentIndex = nextIndex;
			goToSlide(nextIndex);
		}
	}

	function prevSlide() {
		if (!banners.length || !carouselContainer) return;
		
		if (isDesktop) {
			const newScrollPosition = carouselContainer.scrollLeft + carouselContainer.offsetWidth;
			const maxScroll = carouselContainer.scrollWidth - carouselContainer.offsetWidth;
			
			if (newScrollPosition >= maxScroll) {
				carouselContainer.scrollTo({ left: 0, behavior: 'smooth' });
				currentIndex = 0;
			} else {
				carouselContainer.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
				currentIndex = Math.round(newScrollPosition / carouselContainer.offsetWidth);
			}
		} else {
			const prevIndex = currentIndex <= 0 ? banners.length - 1 : currentIndex - 1;
			currentIndex = prevIndex;
			goToSlide(prevIndex);
		}
	}

	function checkDevice() {
		if (typeof window !== 'undefined') {
			isDesktop = window.innerWidth > 768;
		}
	}

	onMount(() => {
		checkDevice();
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', checkDevice);
			return () => window.removeEventListener('resize', checkDevice);
		}
	});

	$: banners = $platformBannersQuery.data || [];
	$: maxSlides = isDesktop ? Math.ceil(banners.length / 3) : banners.length;
</script>

{#if banners.length > 0}
	<section class="platform-banners-wrapper">
		<div class="carousel-container">
			<div 
				class="platform-banners-grid"
				bind:this={carouselContainer}
				on:scroll={handleScroll}
			>
				{#each banners as banner (banner.id)}
					<div
						class="banner-item"
						role="button"
						tabindex="0"
						on:click={() => handleBannerClick(banner)}
						on:keydown={(e) => e.key === 'Enter' && handleBannerClick(banner)}
					>
						<img src={banner.image_url} alt="Platform banner" loading="lazy" />
					</div>
				{/each}
			</div>
			
			{#if banners.length > 3 && isDesktop}
				<button class="carousel-btn carousel-btn-prev" on:click={prevSlide} aria-label="Previous banners">
					<ArrowLeft size={20} />
				</button>
				<button class="carousel-btn carousel-btn-next" on:click={nextSlide} aria-label="Next banners">
					<ArrowRight size={20} />
				</button>
			{/if}
		</div>
		
		{#if banners.length > 1}
			<div class="carousel-dots mobile-only">
				{#each Array(maxSlides) as _, index}
					<button 
						class="carousel-dot" 
						class:active={index === currentIndex}
						on:click={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					></button>
				{/each}
			</div>
		{/if}
	</section>
{:else if $platformBannersQuery.isLoading}
	<BannerSkeleton />
{:else if $platformBannersQuery.error}
	<div class="platform-banners-error">Error: {$platformBannersQuery.error.message}</div>
{/if}

<style>
	.platform-banners-wrapper {
		margin: 1rem 0;
	}

	.carousel-container {
		position: relative;
		overflow: hidden;
	}

	.platform-banners-grid {
		display: flex;
		overflow-x: scroll;
		scroll-snap-type: x mandatory;
		gap: 1rem;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.platform-banners-grid::-webkit-scrollbar {
		display: none;
	}

	.banner-item {
		position: relative;
		flex: 0 0 calc(33.333% - 0.667rem);
		height: 200px;
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		scroll-snap-align: start;
	}

	.banner-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.banner-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.banner-item:hover img {
		transform: scale(1.05);
	}

	.carousel-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 12px;
	}

	.mobile-only {
		display: none;
	}

	.carousel-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.carousel-dot.active {
		background: rgba(0, 0, 0, 0.7);
		transform: scale(1.2);
	}

	.carousel-dot:hover {
		background: rgba(0, 0, 0, 0.5);
	}

	.carousel-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		box-sizing: border-box;
		display: none;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 6px;
		margin: 0 auto;
		width: 32px;
		min-width: 32px;
		height: 32px;
		background: rgba(255, 255, 255, 0.6);
		border: 0.5px solid rgba(73, 75, 87, 0.2);
		border-radius: 16px;
		cursor: pointer;
		z-index: 10;
		transition: all 0.2s ease;
		flex: none;
		order: 0;
		flex-grow: 0;
	}

	.carousel-btn:hover {
		background: rgba(255, 255, 255, 0.8);
		transform: translateY(-50%) scale(1.05);
	}

	.carousel-btn :global(svg) {
		width: 20px;
		height: 20px;
		flex: none;
		order: 0;
		flex-grow: 0;
		color: rgba(34, 34, 34, 0.6);
	}

	.carousel-btn-prev {
		left: 8px;
	}

	.carousel-btn-next {
		right: 8px;
	}

	.platform-banners-loading,
	.platform-banners-error {
		padding: 1rem;
		text-align: center;
		border-radius: 8px;
		margin: 1rem 0;
	}

	.platform-banners-loading {
		background-color: #f3f4f6;
		color: #6b7280;
	}

	.platform-banners-error {
		background-color: #fef2f2;
		color: #dc2626;
	}

	@media (max-width: 768px) {
		.platform-banners-wrapper {
			width: 100vw;
			margin: 1rem 0;
			position: relative;
			left: 50%;
			right: 50%;
			margin-left: -50vw;
			margin-right: -50vw;
		}

		.platform-banners-grid {
			display: flex;
			overflow-x: scroll;
			scroll-snap-type: x mandatory;
			gap: 12px;
			height: 250px;
			padding: 0 1rem;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
			-ms-overflow-style: none;
		}

		.platform-banners-grid::-webkit-scrollbar {
			display: none;
		}

		.banner-item {
			flex: 0 0 calc(100vw - 3rem);
			height: 250px;
			border-radius: 12px;
			scroll-snap-align: start;
		}

		.mobile-only {
			display: flex;
			padding: 0 1rem;
		}
	}

	@media (min-width: 769px) {
		.carousel-btn {
			display: block;
		}

		.mobile-only {
			display: none !important;
		}

		.banner-item {
			height: 220px;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.banner-item {
			flex: 0 0 calc(50% - 0.5rem);
		}
	}
</style>