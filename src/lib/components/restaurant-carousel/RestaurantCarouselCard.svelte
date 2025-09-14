<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';

	export let restaurant: Restaurant;

</script>

<a
	href="/restaurant/{restaurant.id}"
	class="restaurant-carousel-card block w-[386px] h-[249px] transform cursor-pointer overflow-hidden rounded-lg bg-white shadow-md m-1"
>
	<img src={restaurant.logo} alt={restaurant.name} class="h-[249px] w-full object-cover hover:scale-105 transition-transform duration-200" />
</a>


