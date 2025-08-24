<script lang="ts">
	import type { Review } from '$lib/types/review';
	import ReviewCard from './ReviewCard.svelte';
	import ReviewForm from './ReviewForm.svelte';

	export let reviews: Review[] | undefined;

	// options data
	let options = [
		{ id: 1, label: 'Үйлчилгээ', icon: '🍴' },
		{ id: 2, label: 'Орчин', icon: '🏠' },
		{ id: 3, label: 'Амт чанар', icon: '🍲' }
	];

	// track selected card
	let selected = 1; // default selected (Үйлчилгээ)

	function handleSubmit(event: CustomEvent<{ rating: number; comment: string }>) {
		// TODO: Handle review submission
		console.log(event.detail);
	}
</script>

<div class="my-6">
	<p class="text-2xl font-bold">Сэтгэгдэл</p>
	<p class="text-sm text-slate-400">Бидэнд санал хүсэлтээ илгээгээрэй</p>

	<div class="flex gap-4 my-4">
		{#each options as option}
			<div
				role="button"
				tabindex="0"
				class="flex h-22 w-22 cursor-pointer flex-col items-center justify-center rounded-xl border-2 shadow-md transition"
				class:border-red-500={selected === option.id}
				class:border-transparent={selected !== option.id}
				on:click={() => (selected = option.id)}
				on:keydown={(e) => e.key === 'Enter' && (selected = option.id)}
			>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-2xl text-red-500"
				>
					{option.icon}
				</div>
				<p class="mt-2 font-medium text-sm text-gray-700">{option.label}</p>
			</div>
		{/each}
	</div>
	<ReviewForm on:submit={handleSubmit} />
	<div>
		{#if reviews}
			{#each reviews as review}
				<ReviewCard {review} />
			{/each}
		{/if}
	</div>
</div>
