<script lang="ts">
  export let type: 'text' | 'password' | 'email' | 'number' = 'text';
  export let label: string;
  export let placeholder = '';
  export let value: string | number = '';
  export let error: string | null = null;
</script>

<div class="input-group">
  <label for={label} class="block text-sm font-medium text-gray-700">{label}</label>
  <input {type} {placeholder} bind:value class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 {error ? 'border-red-500' : ''}" />
  {#if error}
    <span class="text-red-500 text-sm mt-1">{error}</span>
  {/if}
</div>
