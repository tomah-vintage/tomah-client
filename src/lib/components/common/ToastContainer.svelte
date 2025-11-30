<script lang="ts">
	import { toastStore } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
</script>

{#if $toastStore.length > 0}
	<div class="fixed right-4 bottom-4 z-50 w-full max-w-sm space-y-2">
		{#each $toastStore as toast (toast.id)}
			<Toast {toast} />
		{/each}
	</div>
{/if}
