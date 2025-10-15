<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let isMobile = false;
	let isLoading = true;

	// Desktop images
	const desktopImages = [
		'/help/desktop/help-one.webp',
		'/help/desktop/help-two.webp',
		'/help/desktop/help-three.webp',
		'/help/desktop/help-four.webp',
		'/help/desktop/help-five.webp',
		'/help/desktop/help-six.webp',
		'/help/desktop/help-seven.webp'
	];

	// Mobile images
	const mobileImages = [
		'/help/mobile/help-mobile-1.webp',
		'/help/mobile/help-mobile-2.webp',
		'/help/mobile/help-mobile-3.webp',
		'/help/mobile/help-mobile-4.webp',
		'/help/mobile/help-mobile-5.webp'
	];

	$: currentImages = isMobile ? mobileImages : desktopImages;

	onMount(() => {
		if (browser) {
			// Check if device is mobile using multiple methods
			const checkIsMobile = () => {
				// Method 1: Check user agent
				const userAgent = navigator.userAgent.toLowerCase();
				const mobileUserAgents = [
					'android',
					'iphone',
					'ipad',
					'ipod',
					'blackberry',
					'windows phone'
				];
				const hasMobileUserAgent = mobileUserAgents.some((device) => userAgent.includes(device));

				// Method 2: Check screen width
				const hasSmallScreen = window.innerWidth <= 768;

				// Method 3: Check for touch support
				const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

				// Consider mobile if any mobile indicators are present
				return hasMobileUserAgent || (hasSmallScreen && hasTouchSupport);
			};

			isMobile = checkIsMobile();
			isLoading = false;

			// Listen for window resize to update mobile state
			const handleResize = () => {
				isMobile = checkIsMobile();
			};

			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});
</script>

<svelte:head>
	<title>Тусламж - Qpick</title>
	<meta name="description" content="Qpick аппликешнийг хэрхэн ашиглах талаарх тусламж" />
</svelte:head>

<div class={isMobile ? '' : 'container mx-auto max-w-4xl px-4 py-8'}>
	{#if !isMobile}
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-3xl font-bold text-gray-900">Тусламж</h1>
			<p class="text-gray-600">Qpick аппликешнийг хэрхэн ашиглах талаарх заавар</p>
		</div>
	{/if}

	{#if isLoading}
		<div class="flex min-h-[400px] items-center justify-center">
			<div class="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
		</div>
	{:else}
		<div class={isMobile ? '' : 'space-y-8'}>
			{#each currentImages as image, index}
				<div class={isMobile ? '' : 'flex justify-center'}>
					<div class="max-w-full {isMobile ? 'w-full' : 'w-full max-w-4xl'}">
						<img
							src={image}
							alt="Тусламж {index + 1}"
							class="h-auto w-full {isMobile ? '' : 'rounded-lg'}"
							loading={index === 0 ? 'eager' : 'lazy'}
						/>
					</div>
				</div>
			{/each}
		</div>

		<!-- Device info for debugging (remove in production) -->
		<!-- <div class="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
			<p>Device type: {isMobile ? 'Mobile' : 'Desktop'}</p>
			<p>Screen width: {browser ? window.innerWidth : 'Unknown'}px</p>
		</div> -->
	{/if}
</div>

<style>
	/* Custom scrollbar for better UX */
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
