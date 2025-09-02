<script lang="ts">
	export let label: string;
	export let variant: 'primary' | 'secondary' = 'primary';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let className = '';
</script>

<button
	{type}
	class="rounded-lg px-6 py-2 font-semibold transition duration-200 ease-in-out
    {variant === 'primary'
		? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
		: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 focus:ring-gray-300'}
    focus:ring-opacity-50 focus:ring-2 focus:outline-none
    disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{disabled}
	on:click
>
	{label}
</button>
