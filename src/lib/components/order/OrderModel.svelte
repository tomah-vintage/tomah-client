<script>
    import { browser } from '$app/environment';
    import { onDestroy } from 'svelte';
    export let open = false;
    export let onClose = () => {};
    export let width = '400px';
    export let maxHeight = '90vh';
    export let height = null; // optional explicit height

    $: containerStyle = `width: ${width}; ${height ? `height: ${height};` : `max-height: ${maxHeight};`} overflow-y: auto;`;

    // Prevent background scroll when modal is open
    $: if (browser) {
        document.body.style.overflow = open ? 'hidden' : '';
    }

    onDestroy(() => {
        if (browser) document.body.style.overflow = '';
    });
 </script>
  
  {#if open}
    <div 	on:click={onClose} class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div 	on:click|stopPropagation class="bg-white rounded-2xl shadow-lg p-4 relative" style={containerStyle}>
        <!-- Close button -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-black"
          on:click={onClose}
        >
          ✕
        </button>
  
        <!-- Modal Content (slot for flexibility) -->
        <slot />
      </div>
    </div>
  {/if}