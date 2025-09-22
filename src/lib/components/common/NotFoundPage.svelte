<script lang="ts">
	import { Button } from '$lib/components/common';
	import { Search, Home, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let title = 'Хуудас олдсонгүй';
	export let message = 'Уучлаарай, таны хайж буй хуудас олдсонгүй. Хаяг зөв эсэхийг шалгаад дахин оролдоно уу.';
	export let showSearchButton = true;
	export let showBackButton = true;
	export let showHomeButton = true;

	function goHome() {
		goto('/');
	}

	function goBack() {
		history.back();
	}

	function goToSearch() {
		goto('/search');
	}
</script>

<div class="min-h-screen flex items-center justify-center px-4">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<div class="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
				<Search class="w-12 h-12 text-orange-600" />
			</div>
			
			<h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>
			<h2 class="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
			<p class="text-gray-600 mb-8">{message}</p>
		</div>

		<div class="space-y-4">
			{#if showHomeButton}
				<div class="flex justify-center">
					<button
						on:click={goHome}
						class="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
					>
						<Home class="w-5 h-5 mr-2" />
						Нүүр хуудас руу буцах
					</button>
				</div>
			{/if}

			<div class="flex justify-center space-x-4">
				{#if showBackButton}
					<button
						on:click={goBack}
						class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
					>
						<ArrowLeft class="w-4 h-4 mr-2" />
						Буцах
					</button>
				{/if}

				{#if showSearchButton}
					<button
						on:click={goToSearch}
						class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
					>
						<Search class="w-4 h-4 mr-2" />
						Хайх
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>