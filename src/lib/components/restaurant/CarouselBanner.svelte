<script lang="ts">
	import type { Banner } from '$lib/types/banner';
	import type { Restaurant } from '$lib/types/restaurant';
	import { Heart, Share2 } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import { restaurantActions } from '$lib/stores/restaurant';
	import InfiniteCarousel from '$lib/components/common/InfiniteCarousel.svelte';

	export let banners: Banner[];
	export let restaurant: Restaurant | null = null;
	export let restaurantId: number;

	$: isFavorite = restaurant?.is_liked || false;

	async function toggleFavorite(e: MouseEvent) {
		e.stopPropagation();

		if (!$authStore.isAuthenticated) {
			window.location.href = '/auth/login';
			return;
		}

		try {
			const newState = !isFavorite;
			isFavorite = newState;

			await apiFetch(`${env.PUBLIC_BACKEND_URL}/api/restaurant-like/`, {
				method: 'POST',
				body: JSON.stringify({ restaurant: restaurantId })
			});

			restaurantActions.loadRestaurants();
		} catch (error) {
			isFavorite = !isFavorite;
			console.error('Failed to toggle favorite:', error);
		}
	}

	async function handleShare(e: MouseEvent) {
		e.stopPropagation();

		const url = window.location.href;
		const title = restaurant?.name || 'Check out this restaurant';
		const text = `${title} on Tomah`;

		if (navigator.share) {
			try {
				await navigator.share({ title, text, url });
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					copyToClipboard(url);
				}
			}
		} else {
			copyToClipboard(url);
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			alert('Холбоос хуулагдлаа!');
		});
	}
</script>

<div class="relative overflow-hidden rounded-lg" role="region" aria-label="Banner carousel">
	<!-- Action buttons for desktop only -->
	<div class="absolute top-4 right-4 z-10 hidden items-center gap-3 md:flex">
		<button
			on:click={handleShare}
			class="flex items-center justify-center rounded-full bg-white/90 p-3 shadow-lg transition-all hover:scale-110 hover:bg-white"
			aria-label="Share restaurant"
		>
			<Share2 class="h-6 w-6 text-gray-700" />
		</button>

		<button
			on:click={toggleFavorite}
			class="flex items-center justify-center rounded-full bg-white/90 p-3 shadow-lg transition-all hover:scale-110 hover:bg-white"
			aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
		>
			<Heart
				class="h-6 w-6 transition-colors {isFavorite
					? 'fill-red-500 text-red-500'
					: 'text-gray-700'}"
			/>
		</button>
	</div>

	<InfiniteCarousel
		items={banners}
		aspectRatio={banners[0]?.width && banners[0]?.height
			? `${banners[0].width} / ${banners[0].height}`
			: '16 / 9'}
		showArrows={banners.length > 1}
		showDots={banners.length > 1}
		gap={0}
		itemsPerView={1}
		autoPlay={banners.length > 1}
		autoPlayInterval={5000}
		let:item={banner}
	>
		<div class="banner-slide h-80 md:h-96 lg:h-[32rem]">
			<img src={banner.image_url} alt="Restaurant Banner" class="h-full w-full object-cover" />
		</div>
	</InfiniteCarousel>
</div>

<style>
	.banner-slide {
		width: 100%;
		height: 100%;
	}

	.banner-slide img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
