<script lang="ts">
  export let type: 'text' | 'password' | 'email' | 'number' = 'text';
  export let label: string;
  export let placeholder = '';
  export let value: string | number = '';
  export let error: string | null = null;
</script>

<div class="input-group">
  <label for={label}>{label}</label>
  <input {type} {placeholder} {value} on:input on:change class="input {error ? 'input-error' : ''}" />
  {#if error}
    <span class="error">{error}</span>
  {/if}
</div>
