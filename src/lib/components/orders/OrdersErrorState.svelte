<script lang="ts">
	export let error: any;
	export let onRetry: () => void;
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
	<div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
		<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
		</svg>
	</div>
	<h3 class="text-lg font-semibold text-gray-900 mb-2">Алдаа гарлаа</h3>
	<p class="text-gray-600 mb-6">{error.message || 'Захиалгуудыг татахад алдаа гарлаа'}</p>
	<button
		on:click={onRetry}
		class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
	>
		Дахин оролдох
	</button>
</div>