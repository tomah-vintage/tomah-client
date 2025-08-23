<script lang="ts">
	import type { Review } from '$lib/types/review';

	export let review: Review;
</script>

<div class="card">
	<div>
		<span>{review.user.name}</span>
		<span>{review.createdAt}</span>
	</div>
	<div>
		{#each { length: 5 } as _, i}
			<span class={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
		{/each}
	</div>
	<p>{review.comment}</p>
</div>
