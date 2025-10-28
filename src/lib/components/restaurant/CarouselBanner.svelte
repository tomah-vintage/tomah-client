<script lang="ts">
	import type { Banner } from '$lib/types/banner';

	export let banners: Banner[];
	
	let currentIndex = 0;
	let autoSlideInterval: NodeJS.Timeout;
	
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
	
	$: if (banners.length > 1) {
		startAutoSlide();
	}
	
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		stopAutoSlide();
	});
</script>

<div class="relative overflow-hidden rounded-lg" on:mouseenter={stopAutoSlide} on:mouseleave={startAutoSlide} role="region" aria-label="Banner carousel">
	<div class="relative h-64 md:h-80 lg:h-96">
		{#each banners as banner, index}
			<div
				class="absolute inset-0 transition-transform duration-500 ease-in-out"
				style="transform: translateX({(index - currentIndex) * 100}%)"
			>
				<img
					src={banner.image_url}
					alt="Restaurant Banner {index + 1}"
					class="h-full w-full object-cover"
					style={banner.width && banner.height ? `aspect-ratio: ${banner.width}/${banner.height}` : ''}
				/>
			</div>
		{/each}
	</div>
	
	{#if banners.length > 1}
		<!-- Navigation arrows -->
		<button
			class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
			on:click={prevSlide}
			aria-label="Previous banner"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		
		<button
			class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
			on:click={nextSlide}
			aria-label="Next banner"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
		
		<!-- Dots indicator -->
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
			{#each banners as _, index}
				<button
					class="h-2 w-2 rounded-full transition-colors {index === currentIndex ? 'bg-white' : 'bg-white/50'}"
					on:click={() => goToSlide(index)}
					aria-label="Go to banner {index + 1}"
				></button>
			{/each}
		</div>
	{/if}
</div>