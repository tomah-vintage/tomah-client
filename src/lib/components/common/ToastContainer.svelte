<script lang="ts">
	import { toastStore } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
</script>

{#if $toastStore.length > 0}
	<div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
		{#each $toastStore as toast (toast.id)}
			<Toast {toast} />
		{/each}
	</div>
{/if}