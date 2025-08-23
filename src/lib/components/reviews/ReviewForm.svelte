<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ submit: { rating: number; comment: string } }>();

	let rating = 0;
	let comment = '';

	function handleSubmit() {
		dispatch('submit', { rating, comment });
		rating = 0;
		comment = '';
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div>
		<span>Rate:</span>
		<div>
			{#each { length: 5 } as _, i}
				<button
					type="button"
					on:click={() => (rating = i + 1)}
					class={i < rating ? 'text-yellow-400' : 'text-gray-300'}
				>
					★
				</button>
			{/each}
		</div>
	</div>
	<textarea
		bind:value={comment}
		placeholder="Write a review..."
		class="w-full rounded-md border p-2"
	></textarea>
	<button type="submit" class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>Submit</button
	>
</form>
