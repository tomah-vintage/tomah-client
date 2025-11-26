<script lang="ts">
	import type { Banner } from '$lib/types/banner';
	import type { Restaurant } from '$lib/types/restaurant';
	import { Heart, Share2 } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import { restaurantActions } from '$lib/stores/restaurant';

	export let banner: Banner;
	export let restaurant: Restaurant | null = null;
	export let restaurantId: number;

	$: isFavorite = restaurant?.is_liked || false;

	async function toggleFavorite(e: MouseEvent) {
		e.stopPropagation();

		if (!$authStore.isAuthenticated) {
			// Redirect to login or show login modal
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
			// Revert on error
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

<div class="relative overflow-hidden rounded-lg">
	<img
		src={banner.image_url}
		alt="Restaurant Hero Banner"
		class="h-64 w-full object-cover md:h-80 lg:h-96"
		style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
	/>

	<!-- Action buttons for desktop only -->
	<div class="absolute top-4 right-4 hidden items-center gap-3 md:flex">
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
</div>
