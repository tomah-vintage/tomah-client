<script lang="ts">
	import type { MenuItem } from '$lib/types/menu';
	import type { Restaurant, OpenHours } from '$lib/types/restaurant';
	import { Plus, Clock } from 'lucide-svelte';
	import Model from '../order/OrderModel.svelte';
	import MenuItemDetail from './MenuItemDetail.svelte';

	export let item: MenuItem;
	export let restaurantId: number;
	export let restaurant: Restaurant | null = null;

	let showModal = false;
	let showClosedWarning = false;

	function isRestaurantOpen(restaurant: Restaurant | null): boolean {
		if (!restaurant?.open_hours || restaurant.open_hours.length === 0) {
			return true; // Default to open if no hours data
		}

		const now = new Date();
		const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
		const currentTime = now.getHours() * 100 + now.getMinutes(); // e.g., 14:30 = 1430

		const todayHours = restaurant.open_hours.find(hours => hours.day_of_week === currentDay);
		if (!todayHours) return false;

		const openTime = parseInt(todayHours.opening_time.replace(':', ''));
		const closeTime = parseInt(todayHours.closing_time.replace(':', ''));

		return currentTime >= openTime && currentTime <= closeTime;
	}

	function getNextOpeningTime(restaurant: Restaurant | null): string {
		if (!restaurant?.open_hours || restaurant.open_hours.length === 0) {
			return 'Цагийн мэдээлэл байхгүй';
		}

		const now = new Date();
		const currentDay = now.getDay();
		
		// Check if open later today
		const todayHours = restaurant.open_hours.find(hours => hours.day_of_week === currentDay);
		if (todayHours) {
			const currentTime = now.getHours() * 100 + now.getMinutes();
			const openTime = parseInt(todayHours.opening_time.replace(':', ''));
			
			if (currentTime < openTime) {
				return `Өнөөдөр ${todayHours.opening_time}-д нээнэ`;
			}
		}

		// Check next days
		for (let i = 1; i <= 7; i++) {
			const nextDay = (currentDay + i) % 7;
			const nextDayHours = restaurant.open_hours.find(hours => hours.day_of_week === nextDay);
			
			if (nextDayHours) {
				const dayNames = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];
				return `${dayNames[nextDay]} гарагт ${nextDayHours.opening_time}-д нээнэ`;
			}
		}

		return 'Цагийн мэдээлэл байхгүй';
	}

	const handleCardClick = () => {
		if (!isRestaurantOpen(restaurant)) {
			showClosedWarning = true;
		} else {
			showModal = true;
		}
	};

	const closeModal = () => (showModal = false);
	const closeWarning = () => (showClosedWarning = false);
</script>

<button
	on:click={handleCardClick}
	class="relative flex w-[280px] cursor-pointer flex-col gap-1 rounded-2xl bg-white shadow-md 
	hover:shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02]
	{!isRestaurantOpen(restaurant) ? 'opacity-75' : ''}"
	aria-label="Add {item.name} to cart"
>
	<div class="absolute top-1/2 right-6 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md">
		{#if isRestaurantOpen(restaurant)}
			<Plus size={24} class="text-primary" />
		{:else}
			<Clock size={24} class="text-gray-500" />
		{/if}
	</div>
	<img src={item.img_urls[0]} alt={item.name} class="h-[220px] w-[280px] rounded-t-2xl object-cover" />
	<div class="px-5 py-3.5 text-left">
		<p class="font-bold text-left">{item.name}</p>
		<p class="mb-4 text-xs text-gray-500 text-left">{item.description}</p>
		<p class="font-semibold text-red-500 text-left">{item.price}₮</p>
	</div>
</button>

<Model open={showModal} onClose={closeModal} width="600px">
	<MenuItemDetail item={item} onClose={closeModal} restaurantId={restaurantId} />
</Model>

<!-- Restaurant Closed Warning Modal -->
<Model open={showClosedWarning} onClose={closeWarning} width="400px">
	<div class="text-center p-6">
		<div class="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
			<Clock size={32} class="text-orange-600" />
		</div>
		
		<h3 class="text-xl font-bold text-gray-900 mb-2">Ресторан хаалттай байна</h3>
		
		<p class="text-gray-600 mb-4">
			Уучлаарай, одоогоор захиалга авах боломжгүй байна.
		</p>
		
		<div class="bg-blue-50 rounded-lg p-4 mb-6">
			<p class="text-sm text-blue-800 font-medium">
				{getNextOpeningTime(restaurant)}
			</p>
		</div>
		
		<button
			on:click={closeWarning}
			class="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
		>
			Ойлголоо
		</button>
	</div>
</Model>
