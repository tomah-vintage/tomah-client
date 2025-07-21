<script lang="ts">
  export let label: string;
  export let variant: 'primary' | 'secondary' = 'primary';
  export let disabled = false;
</script>

<button
  class="btn {variant === 'primary' ? 'variant-filled-primary' : 'variant-filled-secondary'}"
  {disabled}
  on:click
>
  {label}
</button>
