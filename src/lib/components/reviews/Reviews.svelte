<script lang="ts">
	import type { Review } from '$lib/types/review';
	import ReviewCard from './ReviewCard.svelte';
	import ReviewForm from './ReviewForm.svelte';
	import { MessageSquare } from 'lucide-svelte';

	export let reviews: Review[] | undefined;
	export let restaurantId: number;

	// options data
	let options = [
		{ id: 1, label: 'Үйлчилгээ', icon: '🍴' },
		{ id: 2, label: 'Орчин', icon: '🏠' },
		{ id: 3, label: 'Амт чанар', icon: '🍲' }
	];

	// track selected card
	let selected = 1; // default selected (Үйлчилгээ)

	function handleSubmit(event: CustomEvent<{ rating: number; comment: string }>) {
		// The ReviewForm now handles the API call directly
		console.log('Review submitted successfully');
	}
</script>

<div class="my-8 space-y-8">
	<!-- Header Section -->
	<div class="text-start">
		<h2 class="text-3xl font-bold text-gray-900">Хэрэглэгчдийн сэтгэгдэл</h2>
		<p class="mt-2 text-lg text-gray-600">Бидэнд санал хүсэлтээ илгээгээрэй</p>
	</div>

	<!-- Category Selection -->
	<div class="flex justify-start">
		<div class="flex gap-4 rounded-xl bg-gray-50 p-2">
			{#each options as option}
				<button
					class="focus:ring-opacity-50 flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 bg-white shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:outline-none"
					class:border-red-500={selected === option.id}
					class:bg-red-50={selected === option.id}
					class:border-gray-200={selected !== option.id}
					on:click={() => (selected = option.id)}
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full text-2xl transition-colors duration-200"
						class:bg-red-500={selected === option.id}
						class:text-white={selected === option.id}
						class:bg-red-100={selected !== option.id}
						class:text-red-500={selected !== option.id}
					>
						{option.icon}
					</div>
					<p class="mt-2 text-xs font-medium text-gray-700">{option.label}</p>
				</button>
			{/each}
		</div>
	</div>

	<!-- Review Form -->
	<div class="max-w-2xl">
		<ReviewForm {restaurantId} on:submit={handleSubmit} />
	</div>

	<!-- Reviews List -->
	<div class="max-w-4xl">
		{#if reviews && reviews.length > 0}
			<div class="mb-6">
				<h3 class="text-xl font-semibold text-gray-900">
					Нийт {reviews.length} сэтгэгдэл
				</h3>
			</div>
			<div class="space-y-4">
				{#each reviews as review}
					<ReviewCard {review} />
				{/each}
			</div>
		{:else}
			<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
				<MessageSquare class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-4 text-lg font-medium text-gray-900">Одоогоор сэтгэгдэл байхгүй байна</h3>
				<p class="mt-2 text-gray-500">Эхний сэтгэгдлээ үлдээгээрэй!</p>
			</div>
		{/if}
	</div>
</div>
