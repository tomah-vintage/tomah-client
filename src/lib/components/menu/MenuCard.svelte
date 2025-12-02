<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import type { Restaurant, OpenHours } from '$lib/types/restaurant';
	import { Plus, Minus, Clock, X } from 'lucide-svelte';
	import Model from '../order/OrderModel.svelte';
	import MenuItemDetail from './MenuItemDetail.svelte';
	import { isRestaurantOpen, getNextOpeningTimeMongolian } from '$lib/utils/restaurant';
	import { cart } from '$lib/stores/cart';
	import { currentTable } from '$lib/stores/table';
	import { showSuccess } from '$lib/stores/toast';

	export let item: MenuItem;
	export let restaurantId: number;
	export let restaurant: Restaurant | null = null;

	let showModal = false;
	let showClosedWarning = false;

	// Parse image URLs - can be JSON string, comma-separated string, or array
	$: firstImage = (() => {
		if (Array.isArray(item.img_urls)) {
			return item.img_urls[0] || '';
		}
		if (typeof item.img_urls === 'string') {
			// Try to parse as JSON array first
			try {
				const parsed = JSON.parse(item.img_urls);
				if (Array.isArray(parsed)) {
					return parsed[0] || '';
				}
			} catch {
				// If JSON parse fails, return the string or first item if comma-separated
				return item.img_urls.split(',')[0]?.trim() || item.img_urls;
			}
		}
		return '';
	})();

	$: restaurantIsOpen = restaurant ? isRestaurantOpen(restaurant) : true;
	$: nextOpeningTime = restaurant
		? getNextOpeningTimeMongolian(restaurant)
		: 'Цагийн мэдээлэл байхгүй';
	$: isAtTable = $currentTable !== null;
	$: itemInCart = $cart.find((cartItem) => cartItem.id === item.id);
	$: quantityInCart = itemInCart?.quantity || 0;

	const handleCardClick = () => {
		if (!restaurantIsOpen) {
			showClosedWarning = true;
		} else if (!item.is_available) {
			// Do nothing for unavailable items
			return;
		} else {
			showModal = true;
		}
	};

	const handleAddToCart = (e: MouseEvent) => {
		e.stopPropagation();
		if (!restaurantIsOpen) {
			showClosedWarning = true;
		} else if (item.is_available) {
			const cartItem = {
				...item,
				restaurant_id: restaurantId,
				is_takeout: !isAtTable, // Default: true for online orders, false for table orders
				...(isAtTable && { order_type: 'DINE_IN' as const })
			};
			cart.addItem(cartItem, 1);
			showSuccess('Сагсанд нэмэгдлээ', undefined, 2000);
		}
	};

	const handleIncrement = (e: MouseEvent) => {
		e.stopPropagation();
		if (!restaurantIsOpen) {
			showClosedWarning = true;
		} else if (item.is_available) {
			const cartItem = {
				...item,
				restaurant_id: restaurantId,
				is_takeout: !isAtTable,
				...(isAtTable && { order_type: 'DINE_IN' as const })
			};
			cart.addItem(cartItem, 1);
		}
	};

	const handleDecrement = (e: MouseEvent) => {
		e.stopPropagation();
		if (quantityInCart > 1) {
			cart.updateQuantity(item.id, quantityInCart - 1);
		} else {
			cart.removeItem(item.id);
		}
	};

	const closeModal = () => (showModal = false);
	const closeWarning = () => (showClosedWarning = false);
</script>

<div
	class="group relative flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all
	duration-200 md:w-[280px]
	{!restaurantIsOpen || !item.is_available ? 'opacity-60' : 'hover:border-gray-300 hover:shadow-sm'}"
>
	<button
		on:click={handleCardClick}
		class="text-left"
		disabled={!restaurantIsOpen || !item.is_available}
	>
		<div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
			<img
				src={firstImage}
				alt={item.name}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</div>
		<div class="px-3 py-2.5">
			<h3 class="mb-1 line-clamp-1 text-sm font-semibold text-gray-900">{item.name}</h3>
			<p class="mb-2 line-clamp-2 text-xs text-gray-500">{item.description}</p>
		</div>
	</button>
	<div class="flex items-center justify-between px-3 pb-2.5">
		<div class="flex items-center gap-2">
			<p class="text-base font-bold text-gray-900">{item.price}₮</p>
			{#if !item.is_available}
				<span class="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600"
					>Дууссан</span
				>
			{/if}
		</div>
		{#if quantityInCart > 0}
			<div class="flex items-center gap-2">
				<button
					on:click={handleDecrement}
					class="group/btn flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition-all hover:bg-red-500"
					aria-label="Decrease quantity"
				>
					<Minus size={18} class="text-gray-700 group-hover/btn:text-white" />
				</button>
				<span class="min-w-[20px] text-center text-sm font-semibold text-gray-900"
					>{quantityInCart}</span
				>
				<button
					on:click={handleIncrement}
					class="group/btn flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition-all hover:bg-red-500"
					aria-label="Increase quantity"
					disabled={!restaurantIsOpen || !item.is_available}
				>
					<Plus size={18} class="text-gray-700 group-hover/btn:text-white" />
				</button>
			</div>
		{:else}
			<button
				on:click={handleAddToCart}
				class="group/btn flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition-all hover:bg-red-500 hover:text-white"
				aria-label="Add {item.name} to cart"
				disabled={!restaurantIsOpen || !item.is_available}
			>
				{#if !item.is_available}
					<X size={18} class="text-red-500" />
				{:else if restaurantIsOpen}
					<Plus size={18} class="text-gray-700 group-hover/btn:text-white" />
				{:else}
					<Clock size={18} class="text-gray-500" />
				{/if}
			</button>
		{/if}
	</div>
</div>

<Model open={showModal} onClose={closeModal} width="min(900px, 95vw)">
	<MenuItemDetail {item} onClose={closeModal} {restaurantId} />
</Model>

<!-- Restaurant Closed Warning Modal -->
<Model open={showClosedWarning} onClose={closeWarning} width="400px">
	<div class="p-6 text-center">
		<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
			<Clock size={32} class="text-orange-600" />
		</div>

		<h3 class="mb-2 text-xl font-bold text-gray-900">Ресторан хаалттай байна</h3>

		<p class="mb-4 text-gray-600">Уучлаарай, одоогоор захиалга авах боломжгүй байна.</p>

		<div class="mb-6 rounded-lg bg-blue-50 p-4">
			<p class="text-sm font-medium text-blue-800">
				{nextOpeningTime}
			</p>
		</div>

		<button
			on:click={closeWarning}
			class="bg-primary hover:bg-primary/90 w-full rounded-lg px-4 py-3 font-medium text-white transition-colors"
		>
			Ойлголоо
		</button>
	</div>
</Model>
