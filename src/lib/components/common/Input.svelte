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
		class="w-full rounded-lg border-2 border-transparent bg-neutral-100 py-3 pr-4 pl-4 transition-all duration-200 
		focus:border-primary focus:ring-2 focus:ring-primary-200 focus:bg-white focus:shadow-md
		{error ? 'border-error bg-error/5' : 'hover:bg-neutral-50'} {className}"
	/>
	{#if error}
		<span class="mt-1 text-sm text-red-500">{error}</span>
	{/if}
</div>
