<script lang="ts">
	import type { Review } from '$lib/types/review';
	import ReviewCard from './ReviewCard.svelte';
	import ReviewForm from './ReviewForm.svelte';

	export let reviews: Review[];

	function handleSubmit(event: CustomEvent<{ rating: number; comment: string }>) {
		// TODO: Handle review submission
		console.log(event.detail);
	}
</script>

<div>
	<h2>Reviews</h2>
	<ReviewForm on:submit={handleSubmit} />
	<div>
		{#each reviews as review}
			<ReviewCard {review} />
		{/each}
	</div>
</div>
