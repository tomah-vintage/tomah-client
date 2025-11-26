<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import { cart } from '$lib/stores/cart';
	import { Tag } from 'lucide-svelte';
	import { currentTable } from '$lib/stores/table';

	export let item: MenuItem;
	export let onClose = () => {};
	export let restaurantId: number;

	let quantity = 1;
	let currentImageIndex = 0;
	let orderType: 'DINE_IN' | 'TAKE_OUT' = 'DINE_IN';

	// Check if user is at a table
	$: isAtTable = $currentTable !== null;

	// Parse image URLs - can be comma-separated string or array
	$: imageUrls =
		typeof item.img_urls === 'string'
			? item.img_urls
					.split(',')
					.map((url) => url.trim())
					.filter(Boolean)
			: Array.isArray(item.img_urls)
				? item.img_urls
				: [];

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
			...(isAtTable && { order_type: orderType })
		};
		cart.addItem(cartItem, quantity);
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
<h2 class="mb-6 text-2xl font-bold text-gray-900">Дэлгэрэнгүй</h2>

<div class="flex flex-col gap-6 md:flex-row">
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
		<div class="flex-1 space-y-5">
			<div class="flex items-start justify-between gap-3">
				<div class="flex-1">
					<h3 class="text-2xl font-bold text-gray-900">{item.name}</h3>
					<p class="mt-3 text-base leading-relaxed text-gray-600">{item.description}</p>
				</div>
				{#if !item.is_available}
					<span
						class="flex-shrink-0 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm"
						>Дууссан</span
					>
				{/if}
			</div>

			<!-- Price and Calories -->
			<div class="flex items-center gap-4">
				<div class="text-2xl font-bold text-red-600">
					{item.price.toLocaleString()}₮
				</div>
				{#if metaData?.calories}
					<div class="flex items-center gap-1 text-gray-600">
						<span class="text-sm">{metaData.calories} kcal</span>
					</div>
				{/if}
			</div>

			<!-- Categories -->
			{#if item.categories && item.categories.length > 0}
				<div class="flex flex-wrap items-center gap-2">
					<Tag class="h-4 w-4 text-gray-500" />
					{#each item.categories as category}
						<span class="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700">
							{category}
						</span>
					{/each}
				</div>
			{/if}

			<!-- Ingredients -->
			{#if metaData?.ingredients}
				<div class="rounded-lg bg-gray-50 p-4">
					<div class="flex flex-wrap gap-2">
						{#each typeof metaData.ingredients === 'string' ? metaData.ingredients.split(',') : metaData.ingredients as ingredient}
							<span class="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm">
								{typeof ingredient === 'string' ? ingredient.trim() : ingredient}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Meta info badges -->
			{#if metaData && (metaData.spicy_level || metaData.preparation_time)}
				<div class="flex flex-wrap items-center gap-3">
					{#if metaData.spicy_level}
						<span class="text-lg">{'🌶️'.repeat(metaData.spicy_level)}</span>
					{/if}
					{#if metaData.preparation_time}
						<span class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
							⏱️ {metaData.preparation_time} минут
						</span>
					{/if}
				</div>
			{/if}

			<!-- Allergens warning -->
			{#if metaData?.allergens}
				<div class="rounded-lg bg-amber-50 p-3">
					<p class="text-sm text-amber-900">⚠️ {metaData.allergens}</p>
				</div>
			{/if}

			<!-- Order Type Selector (only shown when at table) -->
			{#if isAtTable}
				<div class="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
					<label
						class="flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-3 transition-colors {orderType ===
						'DINE_IN'
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200 hover:border-gray-300'}"
					>
						<input
							type="radio"
							bind:group={orderType}
							value="DINE_IN"
							class="mt-1 h-4 w-4 text-blue-600"
						/>
						<div class="flex-1">
							<div class="font-medium text-gray-900">🍽️ Ширээний дээр идэх</div>
							<div class="mt-1 text-xs text-gray-600">
								Ширээ #{$currentTable?.id}-д захиалга хүлээн авна
							</div>
						</div>
					</label>

					<label
						class="flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-3 transition-colors {orderType ===
						'TAKE_OUT'
							? 'border-green-500 bg-green-50'
							: 'border-gray-200 hover:border-gray-300'}"
					>
						<input
							type="radio"
							bind:group={orderType}
							value="TAKE_OUT"
							class="mt-1 h-4 w-4 text-green-600"
						/>
						<div class="flex-1">
							<div class="font-medium text-gray-900">🛍️ Авч явах</div>
							<div class="mt-1 text-xs text-gray-600">
								Сав баглаа болон хүргэлтийн төлбөр тусгагдана
							</div>
						</div>
					</label>
				</div>
			{/if}
		</div>

		<!-- Quantity + Price -->
		<div class="mt-6 space-y-4 border-t border-gray-200 pt-6">
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

				<div class="text-3xl font-bold text-red-600">
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
