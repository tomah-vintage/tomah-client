<script lang="ts">
	export let label: string;
	export let variant: 'primary' | 'secondary' = 'primary';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let className = '';
</script>

<button
	{type}
	class="rounded-lg px-6 py-2 font-semibold transition-all duration-200 ease-in-out transform
    {variant === 'primary'
		? 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-200 hover:scale-105 shadow-md hover:shadow-lg'
		: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-200 hover:shadow-md'}
    focus:ring-4 focus:outline-none active:scale-95
    disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none {className}"
	{disabled}
	on:click
>
	{label}
</button>
