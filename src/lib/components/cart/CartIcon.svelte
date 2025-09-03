<script lang="ts">
	import { cartQuantity } from '$lib/stores/cart';
	import Icon from '$lib/components/common/Icon.svelte';

	let showCart = false;
</script>

<button on:click={() => (showCart = !showCart)} class="relative">
	<Icon name="shopping-cart" />
	{#if $cartQuantity > 0}
		<span
			class="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
		>
			{$cartQuantity}
		</span>
	{/if}
</button>
