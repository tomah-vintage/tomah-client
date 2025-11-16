<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X, Clock } from 'lucide-svelte';
	import Modal from '$lib/components/common/Modal.svelte';

	export let showModal = false;
	export let restaurantHours: { open: string; close: string } = { open: '09:00', close: '22:00' };

	const dispatch = createEventDispatcher<{
		close: void;
		confirm: { date: string; time: string; isAsap: boolean };
	}>();

	let selectedDate = '';
	let selectedTime = '';
	let isAsap = true;

	// Generate time slots (every 15 minutes)
	function generateTimeSlots(): string[] {
		const slots: string[] = [];
		const [openHour, openMin] = restaurantHours.open.split(':').map(Number);
		const [closeHour, closeMin] = restaurantHours.close.split(':').map(Number);

		let hour = openHour;
		let min = openMin;

		while (hour < closeHour || (hour === closeHour && min <= closeMin)) {
			slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
			min += 15;
			if (min >= 60) {
				min = 0;
				hour++;
			}
		}

		return slots;
	}

	// Generate available dates (today + next 7 days)
	function generateDates(): { value: string; label: string }[] {
		const dates: { value: string; label: string }[] = [];
		const today = new Date();

		for (let i = 0; i < 7; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);

			const value = date.toISOString().split('T')[0];
			const label =
				i === 0
					? 'Өнөөдөр'
					: i === 1
						? 'Маргааш'
						: date.toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' });

			dates.push({ value, label });
		}

		return dates;
	}

	$: timeSlots = generateTimeSlots();
	$: availableDates = generateDates();

	// Initialize with today's date
	$: if (showModal && !selectedDate) {
		selectedDate = availableDates[0]?.value || '';
	}

	function handleAsapToggle() {
		isAsap = !isAsap;
		if (isAsap) {
			selectedDate = '';
			selectedTime = '';
		} else {
			selectedDate = availableDates[0]?.value || '';
		}
	}

	function handleConfirm() {
		if (isAsap) {
			dispatch('confirm', { date: '', time: '', isAsap: true });
		} else if (selectedDate && selectedTime) {
			dispatch('confirm', { date: selectedDate, time: selectedTime, isAsap: false });
		} else {
			// Show validation error
			return;
		}
		closeModal();
	}

	function closeModal() {
		dispatch('close');
		// Reset state
		isAsap = true;
		selectedDate = '';
		selectedTime = '';
	}

	// Filter time slots based on current time if today is selected
	function getFilteredTimeSlots(): string[] {
		if (selectedDate === availableDates[0]?.value) {
			const now = new Date();
			const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

			return timeSlots.filter((slot) => slot > currentTime);
		}
		return timeSlots;
	}

	$: filteredTimeSlots = getFilteredTimeSlots();
</script>

<Modal {showModal} on:close={closeModal}>
	<div class="relative max-h-[80vh] overflow-y-auto">
		<div class="mb-6 flex items-center gap-2">
			<Clock class="h-6 w-6 text-red-600" />
			<h2 class="text-xl font-bold text-gray-900">Цаг сонгох</h2>
		</div>

		<div class="space-y-6">
			<!-- ASAP Option -->
			<div class="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-red-300">
				<label class="flex cursor-pointer items-center justify-between">
					<div>
						<h3 class="font-semibold text-gray-900">Яаралтай (ASAP)</h3>
						<p class="text-sm text-gray-500">Боломжит хамгийн хурдан хүргэлт</p>
					</div>
					<input
						type="radio"
						name="deliveryType"
						checked={isAsap}
						on:change={handleAsapToggle}
						class="h-5 w-5 text-red-600 focus:ring-red-500"
					/>
				</label>
			</div>

			<!-- Scheduled Option -->
			<div class="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-red-300">
				<label class="mb-4 flex cursor-pointer items-center justify-between">
					<div>
						<h3 class="font-semibold text-gray-900">Цаг товлох</h3>
						<p class="text-sm text-gray-500">Тодорхой цагт захиалах</p>
					</div>
					<input
						type="radio"
						name="deliveryType"
						checked={!isAsap}
						on:change={handleAsapToggle}
						class="h-5 w-5 text-red-600 focus:ring-red-500"
					/>
				</label>

				{#if !isAsap}
					<div class="mt-4 space-y-4">
						<!-- Date Selection -->
						<div>
							<label for="date" class="mb-2 block text-sm font-medium text-gray-700">
								Өдөр сонгох
							</label>
							<select
								id="date"
								bind:value={selectedDate}
								class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
							>
								{#each availableDates as date}
									<option value={date.value}>{date.label}</option>
								{/each}
							</select>
						</div>

						<!-- Time Selection -->
						<div>
							<label for="time" class="mb-2 block text-sm font-medium text-gray-700">
								Цаг сонгох
							</label>
							{#if filteredTimeSlots.length > 0}
								<select
									id="time"
									bind:value={selectedTime}
									class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
								>
									<option value="">Цаг сонгоно уу</option>
									{#each filteredTimeSlots as slot}
										<option value={slot}>{slot}</option>
									{/each}
								</select>
							{:else}
								<p class="text-sm text-gray-500">Өнөөдөр боломжит цаг байхгүй байна</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Operating Hours Info -->
			<div class="rounded-lg bg-gray-50 p-3">
				<p class="text-sm text-gray-600">
					<span class="font-medium">Ажлын цаг:</span>
					{restaurantHours.open} - {restaurantHours.close}
				</p>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="mt-6 flex gap-3">
			<button
				on:click={closeModal}
				class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
			>
				Цуцлах
			</button>
			<button
				on:click={handleConfirm}
				disabled={!isAsap && (!selectedDate || !selectedTime)}
				class="flex-1 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
			>
				Баталгаажуулах
			</button>
		</div>
	</div>
</Modal>

<style>
	/* Custom radio button styling */
	input[type='radio']:checked {
		accent-color: #eb1600;
	}
</style>
