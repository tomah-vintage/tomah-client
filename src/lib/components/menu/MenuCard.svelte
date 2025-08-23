<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import Button from '$lib/components/common/Button.svelte';
	import { cartStore } from '$lib/stores/cart';

	export let item: MenuItem;

	function addToCart() {
		cartStore.addItem(item);
	}
</script>

<div class="card">
	<img src={item.image_url} alt={item.name} />
	<h3>{item.name}</h3>
	<p>{item.description}</p>
	<span>${item.price}</span>
	<Button label="Add to Cart" on:click={addToCart} />
</div>
