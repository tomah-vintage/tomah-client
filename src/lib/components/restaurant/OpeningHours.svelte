<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { Clock } from 'lucide-svelte';
	import { getRestaurantStatus, getNextOpeningTimeMongolian } from '$lib/utils/restaurant';

	export let restaurant: Restaurant;

	$: status = getRestaurantStatus(restaurant);
	$: nextOpeningInfo = getNextOpeningTimeMongolian(restaurant);

	function formatTime(timeStr: string): string {
		return timeStr.substring(0, 5); // Remove seconds
	}

	function getCurrentDayOfWeek(): number {
		const jsDay = new Date().getDay();
		return jsDay === 0 ? 7 : jsDay; // Convert Sunday from 0 to 7
	}

	$: currentDay = getCurrentDayOfWeek();

	const dayNames = ['', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'];
</script>

<div class="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
	<div class="flex items-center gap-2 mb-3">
		<Clock size={20} class="text-gray-600" />
		<h3 class="font-semibold text-gray-900">Ажиллах цаг</h3>
		<span
			class="rounded-full px-2 py-0.5 text-xs font-semibold {status.isOpen
				? 'bg-green-100 text-green-700'
				: 'bg-red-100 text-red-700'}"
		>
			{status.isOpen ? 'Нээлттэй' : 'Хаалттай'}
		</span>
	</div>

	{#if restaurant.open_hours && restaurant.open_hours.length > 0}
		<div class="space-y-1">
			{#each restaurant.open_hours as hours}
				<div
					class="flex justify-between py-1 px-2 rounded {hours.day_of_week === currentDay
						? 'bg-red-50 font-medium'
						: ''}"
				>
					<span class="text-gray-700">{dayNames[hours.day_of_week]}</span>
					<span class="text-gray-600">
						{formatTime(hours.opening_time)} - {formatTime(hours.closing_time)}
					</span>
				</div>
			{/each}
		</div>

		{#if !status.isOpen && nextOpeningInfo}
			<div class="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
				{nextOpeningInfo}
			</div>
		{/if}
	{:else if restaurant.openingHours}
		<p class="text-gray-600">{restaurant.openingHours}</p>
	{:else}
		<p class="text-gray-500">Цагийн мэдээлэл байхгүй</p>
	{/if}
</div>