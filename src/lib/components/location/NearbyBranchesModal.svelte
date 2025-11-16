<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X, MapPin, Clock, Navigation } from 'lucide-svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import type { Restaurant } from '$lib/types/restaurant';

	export let showModal = false;
	export let branches: Restaurant[] = [];
	export let userLocation: { latitude: number; longitude: number } | null = null;

	const dispatch = createEventDispatcher<{
		close: void;
		select: Restaurant;
	}>();

	function closeModal() {
		dispatch('close');
	}

	function selectBranch(branch: Restaurant) {
		dispatch('select', branch);
		closeModal();
	}

	// Calculate distance between two coordinates (Haversine formula)
	function calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number {
		const R = 6371; // Earth's radius in km
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	// Get distance for display
	function getDistance(branch: Restaurant): string {
		if (!userLocation || !branch.latitude || !branch.longitude) {
			return 'N/A';
		}

		const distance = calculateDistance(
			userLocation.latitude,
			userLocation.longitude,
			parseFloat(branch.latitude),
			parseFloat(branch.longitude)
		);

		if (distance < 1) {
			return `${Math.round(distance * 1000)}м`;
		}
		return `${distance.toFixed(1)}км`;
	}

	// Sort branches by distance
	$: sortedBranches = userLocation
		? [...branches].sort((a, b) => {
				if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;

				const distA = calculateDistance(
					userLocation.latitude,
					userLocation.longitude,
					parseFloat(a.latitude),
					parseFloat(a.longitude)
				);
				const distB = calculateDistance(
					userLocation.latitude,
					userLocation.longitude,
					parseFloat(b.latitude),
					parseFloat(b.longitude)
				);

				return distA - distB;
			})
		: branches;

	function getOperatingStatus(branch: Restaurant): { isOpen: boolean; text: string } {
		// This is a placeholder - you should implement actual operating hours logic
		// For now, assume all branches are open 9:00 - 22:00
		const now = new Date();
		const currentHour = now.getHours();

		const isOpen = currentHour >= 9 && currentHour < 22;

		return {
			isOpen,
			text: isOpen ? 'Нээлттэй' : 'Хаалттай'
		};
	}
</script>

<Modal {showModal} on:close={closeModal}>
	<div class="relative max-h-[80vh] overflow-y-auto">
		<div class="sticky top-0 z-10 mb-6 flex items-center justify-between bg-white pb-4">
			<div class="flex items-center gap-2">
				<MapPin class="h-6 w-6 text-red-600" />
				<h2 class="text-xl font-bold text-gray-900">Ойр байгаа салбарууд</h2>
			</div>
			<button on:click={closeModal} class="text-gray-400 transition-colors hover:text-gray-600">
				<X class="h-6 w-6" />
			</button>
		</div>

		{#if !userLocation}
			<div class="rounded-lg bg-yellow-50 p-4 text-center">
				<p class="text-sm text-yellow-800">
					Ойрын салбаруудыг харуулахын тулд байршлаа идэвхжүүлнэ үү
				</p>
			</div>
		{/if}

		<div class="space-y-3">
			{#if sortedBranches.length === 0}
				<div class="py-8 text-center">
					<MapPin class="mx-auto mb-3 h-12 w-12 text-gray-400" />
					<p class="text-gray-600">Ойр байгаа салбар олдсонгүй</p>
				</div>
			{:else}
				{#each sortedBranches as branch, index}
					{@const status = getOperatingStatus(branch)}
					<button
						on:click={() => selectBranch(branch)}
						class="w-full rounded-lg border-2 border-gray-200 p-4 text-left transition-all hover:border-red-300 hover:shadow-md"
					>
						<div class="flex gap-4">
							<!-- Branch Logo -->
							{#if branch.logo}
								<img
									src={branch.logo}
									alt={branch.name}
									class="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
								/>
							{:else}
								<div
									class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100"
								>
									<MapPin class="h-8 w-8 text-gray-400" />
								</div>
							{/if}

							<!-- Branch Info -->
							<div class="flex-1">
								<div class="mb-1 flex items-start justify-between">
									<h3 class="font-semibold text-gray-900">{branch.name}</h3>
									{#if userLocation}
										<div class="flex items-center gap-1 text-sm font-medium text-red-600">
											<Navigation class="h-4 w-4" />
											<span>{getDistance(branch)}</span>
										</div>
									{/if}
								</div>

								<p class="mb-2 text-sm text-gray-600">{branch.address}</p>

								<div class="flex items-center gap-4">
									<div class="flex items-center gap-1">
										<Clock class="h-4 w-4 text-gray-400" />
										<span class="text-xs text-gray-500">09:00 - 22:00</span>
									</div>
									<span
										class={`rounded-full px-2 py-1 text-xs font-medium ${
											status.isOpen
												? 'bg-green-100 text-green-700'
												: 'bg-red-100 text-red-700'
										}`}
									>
										{status.text}
									</span>
								</div>
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>

		<!-- Close Button -->
		<div class="mt-6">
			<button
				on:click={closeModal}
				class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
			>
				Хаах
			</button>
		</div>
	</div>
</Modal>
