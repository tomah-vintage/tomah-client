<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	export let items: any[] = [];
	export let aspectRatio: string = '16 / 9';
	export let showArrows: boolean = true;
	export let showDots: boolean = true;
	export let gap: number = 0;
	export let itemsPerView: number = 1;
	export let autoPlay: boolean = false;
	export let autoPlayInterval: number = 3000;

	let carouselContainer: HTMLElement;
	let currentIndex = 0;
	let isDragging = false;
	let startX = 0;
	let startTime = 0;
	let scrollLeft = 0;
	let velocity = 0;
	let lastX = 0;
	let lastTime = 0;
	let isInfiniteScrollEnabled = false;
	let isDesktop = false;
	let autoPlayTimer: number | null = null;

	$: infiniteItems = items.length > 0 ? [...items, ...items, ...items] : [];

	function handleScroll() {
		if (!carouselContainer || !infiniteItems.length || !isInfiniteScrollEnabled) return;

		const scrollLeft = carouselContainer.scrollLeft;
		const scrollWidth = carouselContainer.scrollWidth;
		const containerWidth = carouselContainer.offsetWidth;
		const itemWidth = containerWidth / itemsPerView;
		const actualItemsCount = items.length;

		// Infinite scroll logic
		if (scrollLeft <= itemWidth / 2) {
			// Scrolled to the beginning, jump to the middle set
			carouselContainer.scrollLeft = itemWidth * actualItemsCount;
			isInfiniteScrollEnabled = false;
			setTimeout(() => {
				isInfiniteScrollEnabled = true;
			}, 50);
		} else if (scrollLeft + containerWidth >= scrollWidth - itemWidth / 2) {
			// Scrolled to the end, jump to the middle set
			carouselContainer.scrollLeft = itemWidth * actualItemsCount;
			isInfiniteScrollEnabled = false;
			setTimeout(() => {
				isInfiniteScrollEnabled = true;
			}, 50);
		}

		// Update current index
		const rawIndex = Math.round(scrollLeft / itemWidth);
		currentIndex = rawIndex % actualItemsCount;
	}

	function goToSlide(index: number) {
		if (!carouselContainer || !items.length) return;

		const itemWidth = carouselContainer.offsetWidth / itemsPerView;
		const targetIndex = items.length + index;

		carouselContainer.scrollTo({
			left: targetIndex * itemWidth,
			behavior: 'smooth'
		});
	}

	function nextSlide() {
		if (!items.length || !carouselContainer) return;

		const itemWidth = carouselContainer.offsetWidth / itemsPerView;
		const currentScroll = carouselContainer.scrollLeft;

		carouselContainer.scrollTo({
			left: currentScroll + itemWidth,
			behavior: 'smooth'
		});
	}

	function prevSlide() {
		if (!items.length || !carouselContainer) return;

		const itemWidth = carouselContainer.offsetWidth / itemsPerView;
		const currentScroll = carouselContainer.scrollLeft;

		carouselContainer.scrollTo({
			left: currentScroll - itemWidth,
			behavior: 'smooth'
		});
	}

	function snapToNearest() {
		if (!carouselContainer) return;

		const itemWidth = carouselContainer.offsetWidth / itemsPerView;
		const currentScroll = carouselContainer.scrollLeft;
		const targetIndex = Math.round(currentScroll / itemWidth);

		carouselContainer.scrollTo({
			left: targetIndex * itemWidth,
			behavior: 'smooth'
		});
	}

	function handleMouseDown(e: MouseEvent) {
		if (!carouselContainer) return;
		isDragging = true;
		startX = e.pageX;
		lastX = e.pageX;
		startTime = Date.now();
		lastTime = Date.now();
		scrollLeft = carouselContainer.scrollLeft;
		velocity = 0;
		carouselContainer.style.cursor = 'grabbing';
		carouselContainer.style.scrollSnapType = 'none';
		stopAutoPlay();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		e.preventDefault();

		const currentTime = Date.now();
		const currentX = e.pageX;
		const deltaX = currentX - lastX;
		const deltaTime = currentTime - lastTime;

		if (deltaTime > 0) {
			velocity = deltaX / deltaTime;
		}

		const walk = startX - currentX;
		carouselContainer.scrollLeft = scrollLeft + walk;

		lastX = currentX;
		lastTime = currentTime;
	}

	function handleMouseUp() {
		if (!isDragging) return;
		isDragging = false;

		if (carouselContainer) {
			carouselContainer.style.cursor = 'grab';
			carouselContainer.style.scrollSnapType = 'x mandatory';

			// Apply momentum if velocity is significant
			const threshold = 0.5;
			if (Math.abs(velocity) > threshold) {
				const itemWidth = carouselContainer.offsetWidth / itemsPerView;
				const momentum = velocity * 200; // Adjust multiplier for feel
				const targetScroll = carouselContainer.scrollLeft - momentum;
				const targetIndex = Math.round(targetScroll / itemWidth);

				carouselContainer.scrollTo({
					left: targetIndex * itemWidth,
					behavior: 'smooth'
				});
			} else {
				snapToNearest();
			}
		}

		if (autoPlay) {
			startAutoPlay();
		}
	}

	function handleMouseLeave() {
		if (isDragging) {
			handleMouseUp();
		}
	}

	function handleTouchStart(e: TouchEvent) {
		if (!carouselContainer) return;
		isDragging = true;
		startX = e.touches[0].pageX;
		lastX = e.touches[0].pageX;
		startTime = Date.now();
		lastTime = Date.now();
		scrollLeft = carouselContainer.scrollLeft;
		velocity = 0;
		carouselContainer.style.scrollSnapType = 'none';
		stopAutoPlay();
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging) return;

		const currentTime = Date.now();
		const currentX = e.touches[0].pageX;
		const deltaX = currentX - lastX;
		const deltaTime = currentTime - lastTime;

		if (deltaTime > 0) {
			velocity = deltaX / deltaTime;
		}

		const walk = startX - currentX;
		carouselContainer.scrollLeft = scrollLeft + walk;

		lastX = currentX;
		lastTime = currentTime;
	}

	function handleTouchEnd() {
		if (!isDragging) return;
		isDragging = false;

		if (carouselContainer) {
			carouselContainer.style.scrollSnapType = 'x mandatory';

			// Apply momentum if velocity is significant
			const threshold = 0.5;
			if (Math.abs(velocity) > threshold) {
				const itemWidth = carouselContainer.offsetWidth / itemsPerView;
				const momentum = velocity * 200; // Adjust multiplier for feel
				const targetScroll = carouselContainer.scrollLeft - momentum;
				const targetIndex = Math.round(targetScroll / itemWidth);

				carouselContainer.scrollTo({
					left: targetIndex * itemWidth,
					behavior: 'smooth'
				});
			} else {
				snapToNearest();
			}
		}

		if (autoPlay) {
			startAutoPlay();
		}
	}

	function checkDevice() {
		if (typeof window !== 'undefined') {
			isDesktop = window.innerWidth > 768;
		}
	}

	function startAutoPlay() {
		if (!autoPlay) return;
		stopAutoPlay();
		autoPlayTimer = window.setInterval(() => {
			nextSlide();
		}, autoPlayInterval);
	}

	function stopAutoPlay() {
		if (autoPlayTimer !== null) {
			clearInterval(autoPlayTimer);
			autoPlayTimer = null;
		}
	}

	onMount(() => {
		checkDevice();
		isInfiniteScrollEnabled = true;

		// Initialize scroll position to start at the middle set
		if (carouselContainer && items.length > 0) {
			setTimeout(() => {
				const itemWidth = carouselContainer.offsetWidth / itemsPerView;
				carouselContainer.scrollLeft = itemWidth * items.length;
			}, 100);
		}

		if (autoPlay) {
			startAutoPlay();
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', checkDevice);
			return () => {
				window.removeEventListener('resize', checkDevice);
				stopAutoPlay();
			};
		}
	});
</script>

<div class="carousel-wrapper">
	<div class="carousel-container">
		<div
			class="carousel-track"
			bind:this={carouselContainer}
			on:scroll={handleScroll}
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
			on:mouseleave={handleMouseLeave}
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:touchend={handleTouchEnd}
			style="gap: {gap}px;"
		>
			{#each infiniteItems as item, index (item.id + '-' + index)}
				<div
					class="carousel-item"
					style="aspect-ratio: {aspectRatio}; flex: 0 0 calc({100 / itemsPerView}% - {(gap *
						(itemsPerView - 1)) /
						itemsPerView}px);"
				>
					<slot {item} {index} />
				</div>
			{/each}
		</div>

		{#if showArrows && items.length > itemsPerView}
			<button
				class="carousel-btn carousel-btn-prev"
				on:click={prevSlide}
				aria-label="Previous slide"
			>
				<ArrowLeft size={20} />
			</button>
			<button class="carousel-btn carousel-btn-next" on:click={nextSlide} aria-label="Next slide">
				<ArrowRight size={20} />
			</button>
		{/if}
	</div>

	{#if showDots && items.length > 1}
		<div class="carousel-dots">
			{#each items as _, index}
				<button
					class="carousel-dot"
					class:active={index === currentIndex}
					on:click={() => goToSlide(index)}
					aria-label={`Go to slide ${index + 1}`}
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.carousel-wrapper {
		width: 100%;
		position: relative;
	}

	.carousel-container {
		position: relative;
		overflow: hidden;
		width: 100%;
		min-height: 280px;
	}

	@media (min-width: 768px) {
		.carousel-container {
			min-height: 320px;
		}
	}

	@media (min-width: 1024px) {
		.carousel-container {
			min-height: 380px;
		}
	}

	.carousel-track {
		display: flex;
		overflow-x: scroll;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;
		cursor: grab;
		user-select: none;
		scroll-snap-stop: always;
	}

	.carousel-track:active {
		cursor: grabbing;
	}

	.carousel-track::-webkit-scrollbar {
		display: none;
	}

	.carousel-item {
		position: relative;
		overflow: hidden;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		min-height: 280px;
	}

	@media (min-width: 768px) {
		.carousel-item {
			min-height: 320px;
		}
	}

	@media (min-width: 1024px) {
		.carousel-item {
			min-height: 380px;
		}
	}

	.carousel-item :global(*) {
		width: 100%;
		height: 100%;
		min-height: 280px;
		object-fit: cover;
		pointer-events: auto;
		user-select: none;
	}

	@media (min-width: 768px) {
		.carousel-item :global(*) {
			min-height: 320px;
		}
	}

	@media (min-width: 1024px) {
		.carousel-item :global(*) {
			min-height: 380px;
		}
	}

	.carousel-item :global(img) {
		pointer-events: none;
		-webkit-user-drag: none;
		user-select: none;
	}

	.carousel-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 12px;
		padding: 0 1rem;
	}

	.carousel-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0;
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
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 6px;
		width: 32px;
		min-width: 32px;
		height: 32px;
		background: rgba(255, 255, 255, 0.6);
		border: 0.5px solid rgba(73, 75, 87, 0.2);
		border-radius: 16px;
		cursor: pointer;
		z-index: 10;
		transition: all 0.2s ease;
	}

	.carousel-btn:hover {
		background: rgba(255, 255, 255, 0.8);
		transform: translateY(-50%) scale(1.05);
	}

	.carousel-btn :global(svg) {
		width: 20px;
		height: 20px;
		color: rgba(34, 34, 34, 0.6);
	}

	.carousel-btn-prev {
		left: 8px;
	}

	.carousel-btn-next {
		right: 8px;
	}

	@media (max-width: 768px) {
		.carousel-btn {
			display: none;
		}
	}
</style>
