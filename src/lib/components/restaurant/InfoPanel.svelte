<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';

	export let restaurant: Restaurant;
</script>

<div class="card">
	<h2>Restaurant Info</h2>
	<p><strong>Address:</strong> {restaurant.address}</p>
	<p><strong>Opening Hours:</strong> {restaurant.openingHours}</p>
</div>
