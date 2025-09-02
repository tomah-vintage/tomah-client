<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X } from 'lucide-svelte';

	export let showModal: boolean;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center"
		style="background-color: rgba(0, 0, 0, 0.5);"
		on:click={closeModal}
	>
		<div
			class="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
			on:click|stopPropagation
		>
			<button on:click={closeModal} class="absolute top-4 right-4">
				<X class="h-6 w-6 text-gray-500" />
			</button>
			<slot />
		</div>
	</div>
{/if}
