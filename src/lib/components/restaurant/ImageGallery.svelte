<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let images: string[] = [];

	let currentIndex = 0;

	function next() {
		if (currentIndex < images.length - 1) {
			currentIndex += 1;
		} else {
			currentIndex = 0; // Loop back to start
		}
	}

	function prev() {
		if (currentIndex > 0) {
			currentIndex -= 1;
		} else {
			currentIndex = images.length - 1; // Loop to end
		}
	}
</script>

<div class="relative mx-auto w-full max-w-6xl">
	<div class="relative flex items-center">
		<button
			on:click={prev}
			class="focus:ring-primary-light absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:ring-2 focus:outline-none"
		>
			<ChevronLeft size={24} />
		</button>

		<div class="flex-1 overflow-hidden">
			<div
				class="flex transition-transform duration-300 ease-in-out"
				style="transform: translateX(-{currentIndex * 100}%)"
			>
				{#each images as image, i (i)}
					<div class="w-full flex-shrink-0">
						<img src={image} alt="Restaurant" class="h-96 w-full object-cover" />
					</div>
				{/each}
			</div>
		</div>

		<button
			on:click={next}
			class="focus:ring-primary-light absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:ring-2 focus:outline-none"
		>
			<ChevronRight size={24} />
		</button>
	</div>
</div>
