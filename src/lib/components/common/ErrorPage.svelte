<script lang="ts">
	import { Button } from '$lib/components/common';
	import { AlertTriangle, Home, RefreshCcw } from 'lucide-svelte';

	export let title = 'Алдаа гарлаа';
	export let message = 'Уучлаарай, ямар нэгэн алдаа гарлаа. Дахин оролдоно уу.';
	export let showHomeButton = true;
	export let showRefreshButton = true;
	export let statusCode: number | undefined = undefined;

	function goHome() {
		window.location.href = '/';
	}

	function refresh() {
		window.location.reload();
	}
</script>

<div class="min-h-screen flex items-center justify-center px-4">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<div class="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
				<AlertTriangle class="w-12 h-12 text-red-600" />
			</div>
			
			{#if statusCode}
				<h1 class="text-6xl font-bold text-gray-900 mb-2">{statusCode}</h1>
			{/if}
			
			<h2 class="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
			<p class="text-gray-600 mb-8">{message}</p>
		</div>

		<div class="space-y-4">
			{#if showRefreshButton}
				<div class="flex justify-center">
					<button
						on:click={refresh}
						class="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
					>
						<RefreshCcw class="w-5 h-5 mr-2" />
						Дахин оролдох
					</button>
				</div>
			{/if}

			{#if showHomeButton}
				<div class="flex justify-center">
					<button
						on:click={goHome}
						class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
					>
						<Home class="w-5 h-5 mr-2" />
						Нүүр хуудас руу буцах
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>