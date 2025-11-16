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

	/**
	 * Get current day of week matching backend format (0 = Monday, 6 = Sunday)
	 * Backend uses: 0 = Monday, 1 = Tuesday, ..., 5 = Saturday, 6 = Sunday
	 */
	function getCurrentDayOfWeek(): number {
		const jsDay = new Date().getDay();
		// Convert JS day (0=Sun, 1=Mon, ..., 6=Sat) to backend format (0=Mon, 1=Tue, ..., 6=Sun)
		if (jsDay === 0) {
			return 6; // Sunday
		}
		return jsDay - 1; // Monday=0, Tuesday=1, ..., Saturday=5
	}

	$: currentDay = getCurrentDayOfWeek();

	// Day names array matching backend format: 0=Monday, 1=Tuesday, ..., 6=Sunday
	const dayNames = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'];
</script>

<div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
	<div class="mb-3 flex items-center gap-2">
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
					class="flex justify-between rounded px-2 py-1 {hours.day_of_week === currentDay
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
			<div class="mt-3 rounded bg-gray-50 p-2 text-sm text-gray-600">
				{nextOpeningInfo}
			</div>
		{/if}
	{:else if restaurant.openingHours}
		<p class="text-gray-600">{restaurant.openingHours}</p>
	{:else}
		<p class="text-gray-500">Цагийн мэдээлэл байхгүй</p>
	{/if}
</div>
