<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import { cart } from '$lib/stores/cart';
	import { Tag } from 'lucide-svelte';
	import { currentTable } from '$lib/stores/table';
	import { showSuccess } from '$lib/stores/toast';

	export let item: MenuItem;
	export let onClose = () => {};
	export let restaurantId: number;

	let quantity = 1;
	let currentImageIndex = 0;
	let isTakeOut = false;

	// Check if user is at a table
	$: isAtTable = $currentTable !== null;

	// Parse image URLs - can be JSON string, comma-separated string, or array
	$: imageUrls = (() => {
		if (Array.isArray(item.img_urls)) {
			return item.img_urls;
		}
		if (typeof item.img_urls === 'string') {
			// Try to parse as JSON array first
			try {
				const parsed = JSON.parse(item.img_urls);
				if (Array.isArray(parsed)) {
					return parsed;
				}
			} catch {
				// If JSON parse fails, try comma-separated
				return item.img_urls
					.split(',')
					.map((url) => url.trim())
					.filter(Boolean);
			}
		}
		return [];
	})();

	// Parse meta_data if it's a string
	$: metaData =
		typeof item.meta_data === 'string'
			? (() => {
					try {
						return JSON.parse(item.meta_data);
					} catch {
						return null;
					}
				})()
			: item.meta_data;

	const increase = () => quantity++;
	const decrease = () => {
		if (quantity > 1) quantity--;
	};

	function addToCart() {
		const cartItem = {
			...item,
			restaurant_id: restaurantId,
			is_takeout: isAtTable ? isTakeOut : true, // Default: true for online, based on toggle for table
			...(isAtTable && { order_type: isTakeOut ? 'TAKE_OUT' : 'DINE_IN' })
		};
		cart.addItem(cartItem, quantity);
		showSuccess('Сагсанд нэмэгдлээ', undefined, 2000);
		onClose();
	}

	function nextImage() {
		if (imageUrls.length > 1) {
			currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
		}
	}

	function prevImage() {
		if (imageUrls.length > 1) {
			currentImageIndex = currentImageIndex === 0 ? imageUrls.length - 1 : currentImageIndex - 1;
		}
	}
</script>

<!-- Title -->
<h2 class="mb-4 text-2xl font-bold text-gray-900">Дэлгэрэнгүй</h2>

<div class="flex flex-col gap-4 md:flex-row">
	<!-- Product Image with Gallery -->
	<div class="relative flex-shrink-0">
		<div
			class="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200 md:h-96 md:w-96"
		>
			{#if imageUrls.length > 0}
				<img
					src={imageUrls[currentImageIndex]}
					alt={item.name}
					class="h-full w-full object-cover"
				/>

				{#if imageUrls.length > 1}
					<!-- Image navigation buttons -->
					<button
						on:click={prevImage}
						class="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white p-2 text-gray-700 transition-colors hover:bg-gray-100"
						aria-label="Previous image"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<button
						on:click={nextImage}
						class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white p-2 text-gray-700 transition-colors hover:bg-gray-100"
						aria-label="Next image"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>

					<!-- Image dots indicator -->
					<div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 space-x-2">
						{#each imageUrls as _, index}
							<button
								on:click={() => (currentImageIndex = index)}
								class="h-2 w-2 rounded-full transition-all {index === currentImageIndex
									? 'w-5 bg-gray-800'
									: 'bg-gray-400 hover:bg-gray-600'}"
								aria-label="Go to image {index + 1}"
							></button>
						{/each}
					</div>
				{/if}
			{:else}
				<div class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
					No Image
				</div>
			{/if}
		</div>
	</div>

	<!-- Product Info -->
	<div class="flex flex-1 flex-col">
		<div class="flex-1 space-y-3">
			<div class="flex items-start justify-between gap-3">
				<div class="flex-1">
					<h3 class="text-xl font-bold text-gray-900">{item.name}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-gray-600">{item.description}</p>
				</div>
				{#if !item.is_available}
					<span
						class="flex-shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm"
						>Дууссан</span
					>
				{/if}
			</div>

			<!-- Price and Calories -->
			<div class="flex items-center gap-3">
				<div class="text-xl font-bold text-red-600">
					{item.price.toLocaleString()}₮
				</div>
				{#if metaData?.calories}
					<div class="flex items-center gap-1 text-gray-600">
						<span class="text-xs">{metaData.calories} kcal</span>
					</div>
				{/if}
			</div>

			<!-- Categories -->
			{#if item.categories && item.categories.length > 0}
				<div class="flex flex-wrap items-center gap-1.5">
					<Tag class="h-3.5 w-3.5 text-gray-400" />
					{#each item.categories as category}
						<span class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
							{category}
						</span>
					{/each}
				</div>
			{/if}

			<!-- Ingredients -->
			{#if metaData?.ingredients}
				<div class="rounded-lg bg-gray-50 p-2.5">
					<div class="flex flex-wrap gap-1.5">
						{#each typeof metaData.ingredients === 'string' ? metaData.ingredients.split(',') : metaData.ingredients as ingredient}
							<span class="rounded-full bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm">
								{typeof ingredient === 'string' ? ingredient.trim() : ingredient}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Meta info badges -->
			{#if metaData && (metaData.spicy_level || metaData.preparation_time)}
				<div class="flex flex-wrap items-center gap-2">
					{#if metaData.spicy_level}
						<span class="text-base">{'🌶️'.repeat(metaData.spicy_level)}</span>
					{/if}
					{#if metaData.preparation_time}
						<span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
							⏱️ {metaData.preparation_time} минут
						</span>
					{/if}
				</div>
			{/if}

			<!-- Allergens warning -->
			{#if metaData?.allergens}
				<div class="rounded-lg bg-amber-50 p-2.5">
					<p class="text-xs text-amber-900">⚠️ {metaData.allergens}</p>
				</div>
			{/if}

			<!-- Order Type Selector (only shown when at table) -->
			{#if isAtTable}
				<div
					class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2.5"
				>
					<div class="flex items-center gap-2 text-sm text-gray-700">
						<span>🛍️</span>
						<span class="font-medium">Авч явах</span>
					</div>
					<button
						type="button"
						on:click={() => (isTakeOut = !isTakeOut)}
						class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {isTakeOut
							? 'bg-green-500'
							: 'bg-gray-300'}"
						role="switch"
						aria-checked={isTakeOut}
					>
						<span
							class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {isTakeOut
								? 'translate-x-6'
								: 'translate-x-1'}"
						></span>
					</button>
				</div>
			{/if}
		</div>

		<!-- Quantity + Price -->
		<div class="mt-4 space-y-3 border-t border-gray-200 pt-4">
			<div class="flex items-center justify-between">
				{#if item.is_available}
					<div class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-1">
						<button
							class="rounded bg-gray-100 px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-200"
							on:click={decrease}
						>
							−
						</button>
						<span class="w-12 text-center text-xl font-bold text-gray-900">{quantity}</span>
						<button
							class="rounded bg-red-500 px-4 py-2 font-bold text-white transition-colors hover:bg-red-600"
							on:click={increase}
						>
							+
						</button>
					</div>
				{:else}
					<div
						class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1 opacity-50"
					>
						<button
							disabled
							class="cursor-not-allowed rounded bg-gray-100 px-4 py-2 font-bold text-gray-400"
							>−</button
						>
						<span class="w-12 text-center text-xl font-bold text-gray-400">1</span>
						<button
							disabled
							class="cursor-not-allowed rounded bg-gray-200 px-4 py-2 font-bold text-gray-400"
							>+</button
						>
					</div>
				{/if}

				<div class="text-2xl font-bold text-red-600">
					{(item.price * quantity).toLocaleString()}₮
				</div>
			</div>

			<!-- Add to Cart Button -->
			{#if item.is_available}
				<button
					on:click={addToCart}
					class="w-full rounded-lg bg-red-500 py-4 font-bold text-white transition-colors hover:bg-red-600"
				>
					<span class="flex items-center justify-center gap-2">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
							/>
						</svg>
						Сагсанд хийх
					</span>
				</button>
			{:else}
				<button
					disabled
					class="w-full cursor-not-allowed rounded-lg bg-gray-300 py-4 font-bold text-gray-500"
				>
					<span class="flex items-center justify-center gap-2">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
						Дууссан байна
					</span>
				</button>
			{/if}
		</div>
	</div>
</div>
