<script lang="ts">
	export let type: 'tel' | 'text' | 'password' | 'email' | 'number' = 'text';
	export let placeholder = '';
	export let value: string | number = '';
	export let error: string | null = null;
	export let className: string = '';
</script>

<div class="input-group">
	<input
		{type}
		{placeholder}
		bind:value
		on:keydown
		class="w-full rounded-lg border-transparent bg-gray-100 py-3 pr-4 pl-4 focus:border-red-500 focus:ring-red-500 {error
			? 'border-red-500'
			: ''} {className}"
	/>
	{#if error}
		<span class="mt-1 text-sm text-red-500">{error}</span>
	{/if}
</div>
