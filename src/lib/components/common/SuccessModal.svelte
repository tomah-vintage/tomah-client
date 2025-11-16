<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { CheckCircle2 } from 'lucide-svelte';

	export let showModal = false;
	export let title = 'Амжилттай';
	export let message = '';
	export let buttonText = 'За';
	export let autoClose = true;
	export let autoCloseDelay = 3000;

	const dispatch = createEventDispatcher<{
		close: void;
		confirm: void;
	}>();

	let timeoutId: NodeJS.Timeout | null = null;

	$: if (showModal && autoClose) {
		startAutoClose();
	}

	function startAutoClose() {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			closeModal();
		}, autoCloseDelay);
	}

	function closeModal() {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		showModal = false;
		dispatch('close');
	}

	function handleConfirm() {
		dispatch('confirm');
		closeModal();
	}

	function handleBackdropClick() {
		if (!autoClose) {
			closeModal();
		}
	}
</script>

{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center"
		style="background-color: rgba(0, 0, 0, 0.5);"
		on:click={handleBackdropClick}
		on:keydown={(e) => {
			if (e.key === 'Escape') closeModal();
		}}
		role="button"
		tabindex="0"
	>
		<div
			class="relative mx-4 flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-2xl"
			on:click|stopPropagation
			on:keydown={() => {}}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- Success Icon -->
			<div
				class="flex h-20 w-20 items-center justify-center rounded-xl bg-yellow-400 shadow-lg"
				style="box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 0px 4px 0px rgba(0, 0, 0, 0.25);"
			>
				<CheckCircle2 class="h-12 w-12 text-white" strokeWidth={3} />
			</div>

			<!-- Title -->
			<h2 class="text-center text-lg font-medium leading-snug text-gray-900">
				{title}
			</h2>

			<!-- Message (optional) -->
			{#if message}
				<p class="text-center text-sm text-gray-600">
					{message}
				</p>
			{/if}

			<!-- Confirm Button -->
			<button
				on:click={handleConfirm}
				class="w-40 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white shadow-md transition-all hover:bg-red-700 active:shadow-inner"
				style="box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.06), 0px 4px 4px 0px rgba(0, 0, 0, 0.06), inset 0px 2px 6px 0px rgba(0, 0, 0, 0.15);"
			>
				{buttonText}
			</button>
		</div>
	</div>
{/if}
