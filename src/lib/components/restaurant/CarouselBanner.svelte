<script lang="ts">
	import type { Banner } from '$lib/types/banner';
	import type { Restaurant } from '$lib/types/restaurant';
	import { Heart, Share2 } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import { restaurantActions } from '$lib/stores/restaurant';

	export let banners: Banner[];
	export let restaurant: Restaurant | null = null;
	export let restaurantId: number;

	let currentIndex = 0;
	let autoSlideInterval: NodeJS.Timeout;

	$: isFavorite = restaurant?.is_liked || false;

	function nextSlide() {
		currentIndex = (currentIndex + 1) % banners.length;
	}

	function prevSlide() {
		currentIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
	}

	function goToSlide(index: number) {
		currentIndex = index;
	}

	function startAutoSlide() {
		if (banners.length > 1) {
			autoSlideInterval = setInterval(nextSlide, 5000);
		}
	}

	function stopAutoSlide() {
		if (autoSlideInterval) {
			clearInterval(autoSlideInterval);
		}
	}

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

	$: if (banners.length > 1) {
		startAutoSlide();
	}

	onDestroy(() => {
		stopAutoSlide();
	});
</script>

<div
	class="relative overflow-hidden rounded-lg"
	on:mouseenter={stopAutoSlide}
	on:mouseleave={startAutoSlide}
	role="region"
	aria-label="Banner carousel"
>
	<div class="relative h-80 md:h-96 lg:h-[32rem]">
		{#each banners as banner, index}
			<div
				class="absolute inset-0 transition-transform duration-500 ease-in-out"
				style="transform: translateX({(index - currentIndex) * 100}%)"
			>
				<img
					src={banner.image_url}
					alt="Restaurant Banner {index + 1}"
					class="h-full w-full object-cover"
					style={banner.width && banner.height
						? `aspect-ratio: ${banner.width}/${banner.height}`
						: ''}
				/>
			</div>
		{/each}
	</div>

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

	{#if banners.length > 1}
		<!-- Navigation arrows -->
		<button
			class="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
			on:click={prevSlide}
			aria-label="Previous banner"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<button
			class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
			on:click={nextSlide}
			aria-label="Next banner"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<!-- Dots indicator -->
		<div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
			{#each banners as _, index}
				<button
					class="h-2 w-2 rounded-full transition-colors {index === currentIndex
						? 'bg-white'
						: 'bg-white/50'}"
					on:click={() => goToSlide(index)}
					aria-label="Go to banner {index + 1}"
				></button>
			{/each}
		</div>
	{/if}
</div>
