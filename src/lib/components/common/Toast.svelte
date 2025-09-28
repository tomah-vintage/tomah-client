<script lang="ts">
	import { onMount } from 'svelte';
	import { toastStore, type Toast } from '$lib/stores/toast';
	import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-svelte';

	export let toast: Toast;

	let visible = false;

	onMount(() => {
		// Trigger animation
		setTimeout(() => {
			visible = true;
		}, 10);
	});

	function getIcon(type: Toast['type']) {
		switch (type) {
			case 'success':
				return CheckCircle;
			case 'error':
				return XCircle;
			case 'warning':
				return AlertCircle;
			case 'info':
				return Info;
			default:
				return Info;
		}
	}

	function getIconColor(type: Toast['type']) {
		switch (type) {
			case 'success':
				return 'text-green-600';
			case 'error':
				return 'text-red-600';
			case 'warning':
				return 'text-yellow-600';
			case 'info':
				return 'text-blue-600';
			default:
				return 'text-gray-600';
		}
	}

	function getBgColor(type: Toast['type']) {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200';
			case 'error':
				return 'bg-red-50 border-red-200';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200';
			case 'info':
				return 'bg-blue-50 border-blue-200';
			default:
				return 'bg-gray-50 border-gray-200';
		}
	}

	function remove() {
		visible = false;
		setTimeout(() => {
			toastStore.remove(toast.id);
		}, 300);
	}
</script>

<div
	class="flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out {getBgColor(toast.type)} {visible 
		? 'translate-x-0 opacity-100' 
		: 'translate-x-full opacity-0'}"
	role="alert"
>
	<svelte:component this={getIcon(toast.type)} class="h-5 w-5 flex-shrink-0 {getIconColor(toast.type)}" />
	
	<div class="flex-1 min-w-0">
		<div class="text-sm font-medium text-gray-900">
			{toast.title}
		</div>
		{#if toast.message}
			<div class="mt-1 text-sm text-gray-600">
				{toast.message}
			</div>
		{/if}
	</div>

	<button
		on:click={remove}
		class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
		aria-label="Close notification"
	>
		<X class="h-4 w-4" />
	</button>
</div>