<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantCarouselCard from './RestaurantCarouselCard.svelte';
	import { createEventDispatcher } from 'svelte';
	import InfiniteCarousel from '$lib/components/common/InfiniteCarousel.svelte';

	const dispatch = createEventDispatcher<{ viewRestaurant: string }>();

	export let restaurants: Restaurant[] = [];

	let containerWidth: number;
	const CARD_WIDTH = 386;
	const CARD_GAP = 20;

	$: cardsToShow = calculateCardsToShow(containerWidth, CARD_WIDTH, CARD_GAP);

	function calculateCardsToShow(width: number, cardWidth: number, cardGap: number): number {
		if (!width || width <= 0) return 1;
		const numCards = (width + cardGap) / (cardWidth + cardGap);
		return Math.max(1, Math.floor(numCards));
	}

	function handleRestaurantView(restaurant: Restaurant) {
		dispatch('viewRestaurant', restaurant.id.toString());
	}
</script>

<div class="relative mb-8 w-full" bind:clientWidth={containerWidth}>
	{#if restaurants.length > 0 && containerWidth && cardsToShow}
		<InfiniteCarousel
			items={restaurants}
			aspectRatio="386 / 249"
			showArrows={true}
			showDots={false}
			gap={CARD_GAP}
			itemsPerView={cardsToShow}
			autoPlay={false}
			let:item={restaurant}
		>
			<RestaurantCarouselCard
				{restaurant}
				on:view={(event) => dispatch('viewRestaurant', event.detail)}
			/>
		</InfiniteCarousel>
	{/if}
</div>
