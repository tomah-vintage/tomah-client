<script lang="ts">
	export let open: boolean = false;
	export let message: string = 'Ажилттай бүртгэгдлээ';

	const closeModal = () => {
		open = false;
		// Optional: emit event or navigate
	};
</script>

{#if open}
	<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
		<div class="w-80 rounded-2xl bg-white p-6 text-center shadow-lg">
			<!-- Success Icon -->
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-10 w-10 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>

			<!-- Message -->
			<p class="mb-6 text-lg font-medium text-gray-800">{message}</p>

			<!-- Finish Button -->
			<button
				on:click={closeModal}
				class="w-full rounded-lg bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
			>
				Дуусгах
			</button>
		</div>
	</div>
{/if}
