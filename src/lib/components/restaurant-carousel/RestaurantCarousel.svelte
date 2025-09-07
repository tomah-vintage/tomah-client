<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCarouselCard from './RestaurantCarouselCard.svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { restaurantStore } from '$lib/stores/restaurant';
	import Carousel from 'svelte-light-carousel';

	const dispatch = createEventDispatcher<{ viewRestaurant: string }>();

	export let restaurants: Restaurant[] = [];
	export let loading = false;

	$: loading = $restaurantStore.loading;

	let containerWidth: number;
	const CARD_WIDTH = 386;
	const CARD_GAP = 24;

	$: cardsToShow = calculateCardsToShow(containerWidth, CARD_WIDTH, CARD_GAP);

	function calculateCardsToShow(width: number, cardWidth: number, cardGap: number): number {
		if (!width || width <= 0) return 1;
		const numCards = (width + cardGap) / (cardWidth + cardGap);
		return Math.max(1, Number(numCards.toFixed(1)));
	}

	function handleCardView(restaurantId: string) {
		dispatch('viewRestaurant', restaurantId);
	}
</script>

<div class="relative w-full mb-8" bind:clientWidth={containerWidth}>
	{#if loading}
		<div></div>
	{:else if restaurants.length > 0 && containerWidth}
		<Carousel
			class="relative"
			slides={restaurants}
			layout={{ default: cardsToShow }}
			gaps={{ default: CARD_GAP }}
		>
			<button
				slot="prev"
				let:prev
				let:canScrollPrev
				on:click={prev}
				disabled={!canScrollPrev}
				class="absolute top-[109px] left-[0] w-fit rounded-full border border-[#494b5733] bg-white/60 p-1.5 text-[#C0C0C0] hover:bg-[#71717A] hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
			>
				<ArrowLeft size={24} />
			</button>
			<button
				slot="next"
				let:next
				let:canScrollNext
				on:click={next}
				disabled={!canScrollNext}
				class="absolute top-[109px] right-[0] w-fit rounded-full border border-[#494b5733] bg-white/60 p-1.5 text-[#C0C0C0] hover:bg-[#71717A] hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
			>
				<ArrowRight size={24} />
			</button>
			<!-- </div> -->

			<div slot="slide" let:slide>
				<RestaurantCarouselCard
					restaurant={slide}
					on:view={(event) => handleCardView(event.detail)}
				/>
			</div>
		</Carousel>
	{/if}
</div>

<style lang="postcss">
	:global(.carousel) {
		overflow: visible !important;
	}
</style>
