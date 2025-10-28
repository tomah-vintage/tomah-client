<script lang="ts">
	import { onMount } from 'svelte';
	
	let isDesktop = false;

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
</script>

<section class="platform-banners-wrapper">
	<div class="carousel-container">
		<div class="platform-banners-grid">
			{#each Array(isDesktop ? 3 : 1) as _, i}
				<div 
					class="banner-skeleton"
					style="animation-delay: {i * 200}ms"
				></div>
			{/each}
		</div>
	</div>
	
	{#if !isDesktop}
		<div class="carousel-dots mobile-only">
			{#each Array(3) as _, index}
				<div class="carousel-dot-skeleton"></div>
			{/each}
		</div>
	{/if}
</section>

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
		overflow-x: hidden;
		gap: 1rem;
	}

	.banner-skeleton {
		position: relative;
		flex: 0 0 calc(33.333% - 0.667rem);
		height: 200px;
		border-radius: 8px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
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

	.carousel-dot-skeleton {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
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
			height: 250px;
			padding: 0 1rem;
		}

		.banner-skeleton {
			flex: 0 0 calc(100vw - 3rem);
			height: 250px;
			border-radius: 12px;
		}

		.mobile-only {
			display: flex;
			padding: 0 1rem;
		}
	}

	@media (min-width: 769px) {
		.mobile-only {
			display: none !important;
		}

		.banner-skeleton {
			height: 220px;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.banner-skeleton {
			flex: 0 0 calc(50% - 0.5rem);
		}
	}
</style>