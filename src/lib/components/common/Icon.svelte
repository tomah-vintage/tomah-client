<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { Home } from 'lucide-svelte';

  export let icon: ComponentType = Home;
  export let size: number | undefined = 16;
  export let color: string = "currentColor";
  export let width: number | undefined = undefined;
  export let height: number | undefined = undefined;

</script>

<svelte:component this={icon} size={width ?? height ?? size} {color} />
