<script lang="ts">
  export let type: 'text' | 'password' | 'email' | 'number' = 'text';
  export let label: string | undefined = undefined;
  export let placeholder = '';
  export let value: string | number = '';
  export let error: string | null = null;
  export let className: string = '';
</script>

<div class="input-group">
  {#if label}
    <label for={label} class="block text-sm font-medium text-gray-700">{label}</label>
  {/if}
  <input {type} {placeholder} bind:value {...$$restProps} on:keydown class="w-full p-2 border border-gray-300 rounded-md focus:outline-none  {error ? 'border-red-500' : ''} {className}" />
  {#if error}
    <span class="text-red-500 text-sm mt-1">{error}</span>
  {/if}
</div>
