<script lang="ts">
	import { currentTable } from '$lib/stores/table';
	import { Hash } from 'lucide-svelte';

	$: table = $currentTable;
</script>

{#if table}
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
		<div class="flex items-center gap-2 text-blue-700">
			<Hash size={16} />
			<span class="text-sm font-medium">
				Ширээ #{table.id}
			</span>
		</div>
		<p class="text-xs text-blue-600 mt-1">
			QR кодоор сканнуулсан ширээ
		</p>
	</div>
{/if}