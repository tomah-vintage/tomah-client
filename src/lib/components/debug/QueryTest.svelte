<script lang="ts">
	import { createRestaurantsQuery } from '$lib/stores/restaurantQuery';
	
	const restaurantsQuery = createRestaurantsQuery();
	$: ({ data, isLoading, error } = $restaurantsQuery);
</script>

<div class="p-4 border rounded-lg">
	<h3 class="font-bold mb-2">TanStack Query Test</h3>
	
	{#if isLoading}
		<p class="text-blue-600">Loading restaurants...</p>
	{:else if error}
		<p class="text-red-600">Error: {error.message}</p>
	{:else if data}
		<p class="text-green-600">✅ Query successful! Loaded {data.results?.length || 0} restaurants</p>
	{:else}
		<p class="text-gray-600">No data</p>
	{/if}
</div>