<script lang="ts">
  export let label: string;
  export let variant: 'primary' | 'secondary' = 'primary';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
  {type}
  class="w-full py-3 px-6 rounded-lg font-semibold transition duration-200 ease-in-out
    {variant === 'primary'
      ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-300'}
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed"
  {disabled}
  on:click
>
  {label}
</button>
