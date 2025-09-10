<script lang="ts">
	import type { Review } from '$lib/types/review';

	export let review: Review;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('mn-MN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getInitials(name: string) {
		return name
			?.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<div
	class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
>
	<div class="mb-4 flex items-start justify-between">
		<div class="flex items-center space-x-3">
			<!-- User Avatar -->
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-sm font-semibold text-white shadow-md"
			>
				{getInitials(review.user)}
			</div>
			<div>
				<h4 class="font-semibold text-gray-900">{review.user}</h4>
				<p class="text-sm text-gray-500">{formatDate(review.created_at)}</p>
			</div>
		</div>

		<!-- Rating Stars -->
		<div class="flex items-center space-x-1">
			{#each { length: 5 } as _, i}
				<svg
					class="h-4 w-4 {i < review.rating ? 'text-yellow-400' : 'text-gray-300'}"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
					/>
				</svg>
			{/each}
			<span class="ml-2 text-sm font-medium text-gray-700">{review.rating}/5</span>
		</div>
	</div>

	<!-- Review Comment -->
	<p class="leading-relaxed text-gray-700">{review.comment}</p>
</div>
