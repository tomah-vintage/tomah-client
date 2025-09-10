<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Send } from 'lucide-svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { apiFetch } from '$lib/utils/api';

	export let restaurantId: number;

	const dispatch = createEventDispatcher<{ submit: { rating: number; comment: string } }>();

	let rating = 0;
	let comment = '';
	let hoveredRating = 0;
	let isSubmitting = false;
	let submitMessage = '';

	async function handleSubmit() {
		if (rating === 0 || comment.trim() === '') {
			return;
		}

		isSubmitting = true;
		submitMessage = '';

		try {
			await apiFetch(`${PUBLIC_BACKEND_URL}/api/review/`, {
				method: 'POST',
				body: JSON.stringify({
					restaurant: restaurantId,
					rating,
					comment: comment.trim()
				})
			});

			dispatch('submit', { rating, comment });
			rating = 0;
			comment = '';
			hoveredRating = 0;
			submitMessage = 'Таны сэтгэгдэл амжилттай нэмэгдлээ!';
			setTimeout(() => (submitMessage = ''), 3000);
		} catch (error) {
			console.error('Error submitting review:', error);
			submitMessage =
				error instanceof Error ? error.message : 'Сүлжээний алдаа. Дахин оролдоно уу.';
		} finally {
			isSubmitting = false;
		}
	}

	function handleStarHover(index: number) {
		hoveredRating = index;
	}

	function handleStarLeave() {
		hoveredRating = 0;
	}

	$: isFormValid = rating > 0 && comment.trim().length > 0;
	$: displayRating = hoveredRating || rating;
</script>

<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<!-- Rating Section -->
		<div>
			<label for="rating" class="mb-3 block text-lg font-semibold text-gray-900">
				Үнэлгээ өгөх
			</label>
			<div class="flex items-center space-x-2">
				{#each { length: 5 } as _, i}
					<button
						type="button"
						on:click={() => (rating = i + 1)}
						on:mouseenter={() => handleStarHover(i + 1)}
						on:mouseleave={handleStarLeave}
						aria-label="Rate {i + 1} stars"
						class="focus:ring-opacity-50 rounded transition-all duration-200 hover:scale-110 focus:ring-2 focus:ring-red-500 focus:outline-none"
					>
						<svg
							class="h-8 w-8 {i < displayRating
								? 'text-yellow-400'
								: 'text-gray-300'} transition-colors duration-200"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							/>
						</svg>
					</button>
				{/each}
				{#if rating > 0}
					<span class="ml-3 text-sm font-medium text-gray-700">
						{rating} / 5 од
					</span>
				{/if}
			</div>
		</div>

		<!-- Comment Section -->
		<div>
			<label for="comment" class="mb-3 block text-lg font-semibold text-gray-900">
				Санал сэтгэгдэл
			</label>
			<div class="relative">
				<textarea
					id="comment"
					bind:value={comment}
					placeholder="Энд таны санал сэтгэгдлийг бичнэ үү..."
					rows="4"
					class="focus:ring-opacity-20 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
				></textarea>
				<div class="absolute right-3 bottom-3 text-xs text-gray-400">
					{comment.length}/500
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="flex items-center justify-between pt-4">
			<div class="text-sm text-gray-500">* Үнэлгээ болон сэтгэгдэл заавал бөглөнө үү</div>
			<button
				type="submit"
				disabled={!isFormValid || isSubmitting}
				class="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {isFormValid &&
				!isSubmitting
					? 'bg-red-500 hover:bg-red-600 hover:shadow-lg'
					: 'bg-gray-400'}"
			>
				<Send class="mr-2 h-4 w-4" />
				{isSubmitting ? 'Илгээж байна...' : 'Санал хүсэлт илгээх'}
			</button>
		</div>

		<!-- Submit Message -->
		{#if submitMessage}
			<div
				class="mt-4 rounded-lg p-3 {submitMessage.includes('амжилттай')
					? 'bg-green-50 text-green-700'
					: 'bg-red-50 text-red-700'}"
			>
				{submitMessage}
			</div>
		{/if}
	</form>
</div>
