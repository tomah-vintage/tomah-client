<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import type { Restaurant, OpenHours } from '$lib/types/restaurant';
	import { Plus, Clock, X } from 'lucide-svelte';
	import Model from '../order/OrderModel.svelte';
	import MenuItemDetail from './MenuItemDetail.svelte';
	import { isRestaurantOpen, getNextOpeningTimeMongolian } from '$lib/utils/restaurant';
	import { cart } from '$lib/stores/cart';
	import { currentTable } from '$lib/stores/table';

	export let item: MenuItem;
	export let restaurantId: number;
	export let restaurant: Restaurant | null = null;

	let showModal = false;
	let showClosedWarning = false;

	$: restaurantIsOpen = restaurant ? isRestaurantOpen(restaurant) : true;
	$: nextOpeningTime = restaurant
		? getNextOpeningTimeMongolian(restaurant)
		: 'Цагийн мэдээлэл байхгүй';
	$: isAtTable = $currentTable !== null;

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
				...(isAtTable && { order_type: 'DINE_IN' as const })
			};
			cart.addItem(cartItem, 1);
		}
	};

	const closeModal = () => (showModal = false);
	const closeWarning = () => (showClosedWarning = false);
</script>

<div
	class="relative flex w-full flex-col gap-1 rounded-2xl bg-white shadow-md transition-all
	duration-300 ease-out md:w-[280px]
	{!restaurantIsOpen || !item.is_available
		? 'opacity-60'
		: 'transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg'}"
>
	<button
		on:click={handleAddToCart}
		class="absolute top-1/2 right-6 z-20 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-lg transition-all hover:scale-110 hover:bg-red-50"
		aria-label="Add {item.name} to cart"
		disabled={!restaurantIsOpen || !item.is_available}
	>
		{#if !item.is_available}
			<X size={24} class="text-red-500" />
		{:else if restaurantIsOpen}
			<Plus size={24} class="text-red-500" />
		{:else}
			<Clock size={24} class="text-gray-500" />
		{/if}
	</button>

	<button
		on:click={handleCardClick}
		class="text-left"
		disabled={!restaurantIsOpen || !item.is_available}
	>
		<img
			src={item.img_urls[0]}
			alt={item.name}
			class="h-[150px] w-full rounded-t-2xl object-cover md:h-[220px] md:w-[280px]"
		/>
		<div class="px-5 py-3.5">
			<p class="text-left font-bold">{item.name}</p>
			<p class="mb-4 text-left text-xs text-gray-500">{item.description}</p>
			<div class="flex items-center justify-between">
				<p class="text-left font-semibold text-red-500">{item.price}₮</p>
				{#if !item.is_available}
					<span class="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-500">Дууссан</span>
				{/if}
			</div>
		</div>
	</button>
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
