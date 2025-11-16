<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { MapPin } from 'lucide-svelte';

	export let showAlert = false;

	const dispatch = createEventDispatcher<{
		allow: void;
		deny: void;
		close: void;
	}>();

	function handleAllow() {
		dispatch('allow');
	}

	function handleDeny() {
		dispatch('deny');
	}
</script>

{#if showAlert}
	<!-- iOS-style backdrop with blur -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
		on:click|self={handleDeny}
		on:keydown={(e) => {
			if (e.key === 'Escape') handleDeny();
		}}
		role="button"
		tabindex="0"
	>
		<!-- Alert Dialog -->
		<div
			class="mx-4 w-full max-w-[270px] overflow-hidden rounded-2xl bg-white/90 shadow-2xl backdrop-blur-xl"
			role="alertdialog"
			aria-modal="true"
		>
			<!-- Icon and Title Section -->
			<div class="px-4 pt-5 pb-4 text-center">
				<div class="mb-3 flex justify-center">
					<div class="rounded-full bg-blue-100 p-3">
						<MapPin class="h-6 w-6 text-blue-600" />
					</div>
				</div>

				<h3 class="mb-2 text-[17px] font-semibold leading-tight text-gray-900">
					"Qpick" таны байршлыг ашиглахыг хүсч байна
				</h3>

				<p class="text-[13px] leading-[18px] text-gray-600">
					Таны байршилд тулгуурлан ойр байгаа ресторануудыг харуулна
				</p>
			</div>

			<!-- Action Buttons -->
			<div class="border-t border-gray-200/50">
				<button
					on:click={handleAllow}
					class="w-full border-b border-gray-200/50 bg-transparent py-3 text-center text-[17px] font-semibold text-blue-600 hover:bg-gray-50/50 active:bg-gray-100/50"
				>
					Зөвшөөрөх
				</button>

				<button
					on:click={handleDeny}
					class="w-full bg-transparent py-3 text-center text-[17px] text-gray-600 hover:bg-gray-50/50 active:bg-gray-100/50"
				>
					Үгүй
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* iOS-style animations */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			transform: scale(1.15);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	div[role='alertdialog'] {
		animation: scaleIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.backdrop-blur-xl {
		animation: fadeIn 0.2s ease-out;
	}
</style>
