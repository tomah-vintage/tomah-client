<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCard from './RestaurantCard.svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import Carousel from 'svelte-light-carousel';

	export let restaurants: Restaurant[] = [];
	export let emptyMessage = 'No restaurants found.';

	let containerWidth: number;
	const CARD_WIDTH = 300;
	const CARD_GAP = 24;

	$: cardsToShow = calculateCardsToShow(containerWidth, CARD_WIDTH, CARD_GAP);

	function calculateCardsToShow(width: number, cardWidth: number, cardGap: number): number {
		if (!width || width <= 0) return 1;
		const numCards = (width + cardGap) / (cardWidth + cardGap);
		return Math.max(1,  Number(numCards.toFixed(1)));
	}
</script>

<div bind:clientWidth={containerWidth}>
	{#if restaurants.length === 0}
		<p class="text-center text-gray-500">{emptyMessage}</p>
	{:else}
		{#if containerWidth}
			<Carousel slides={restaurants} layout={{ default: cardsToShow }} gaps={{ default: CARD_GAP }}>
				<div
					slot="pagination"
					class="absolute top-[-40px] flex w-full justify-end gap-3"
					let:prev
					let:canScrollPrev
					let:next
					let:canScrollNext
				>
					<button
						on:click={prev}
						disabled={!canScrollPrev}
						class="rounded-full border border-[#494b5733] bg-white/60 disabled:bg-transparent p-1.5 text-[#222222] disabled:text-[#C0C0C0] hover:bg-[#71717A] hover:text-white"
					>
						<ArrowLeft size={20} />
					</button>
					<button
						on:click={next}
						disabled={!canScrollNext}
						class="rounded-full border border-[#494b5733] bg-white/60 disabled:bg-transparent p-1.5 text-[#222222] disabled:text-[#C0C0C0] hover:bg-[#71717A] hover:text-white"
					>
						<ArrowRight size={20} />
					</button>
				</div>

				<div slot="slide" let:slide>
					<RestaurantCard restaurant={slide} />
				</div>
			</Carousel>
		{/if}
	{/if}
</div>
