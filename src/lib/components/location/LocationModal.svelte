<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { locationStore } from '$lib/stores/location';
	import { MapPin } from 'lucide-svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import { goto } from '$app/navigation';

	export let showModal = false;

	const dispatch = createEventDispatcher<{
		close: void;
		locationSelected: { latitude: number; longitude: number; radius: number; address?: string };
	}>();

	let customAddress = '';
	const fixedRadius = 10; // Fixed 10km radius
	let isGettingLocation = false;

	function handleClose() {
		showModal = false;
		dispatch('close');
	}

	async function handleGetCurrentLocation() {
		if (isGettingLocation) return;
		
		try {
			isGettingLocation = true;
			const location = await locationStore.getCurrentLocation();
			
			if (location) {
				// Redirect to search page with location parameters
				const searchParams = new URLSearchParams();
				searchParams.set('q', '');
				searchParams.set('latitude', location.latitude.toString());
				searchParams.set('longitude', location.longitude.toString());
				searchParams.set('radius', fixedRadius.toString());
				
				handleClose();
				goto(`/search?${searchParams.toString()}`);
			}
		} catch (error) {
			// Silently handle any errors
		} finally {
			isGettingLocation = false;
		}
	}

	function handleAddressSubmit() {
		if (customAddress.trim()) {
			// In a real app, you would geocode the address to get coordinates
			// For now, we'll use placeholder coordinates and redirect
			const searchParams = new URLSearchParams();
			searchParams.set('q', ''); // Empty search query to show all nearby restaurants
			searchParams.set('latitude', '47.6062'); // Placeholder coordinates
			searchParams.set('longitude', '-122.3321');
			searchParams.set('radius', fixedRadius.toString());
			
			handleClose();
			goto(`/search?${searchParams.toString()}`);
		}
	}
</script>

<Modal {showModal} on:close={handleClose}>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-4">
			<h2 class="text-lg font-semibold">Ойр байгаа байршил</h2>
		</div>

		<!-- Content -->
		<div class="space-y-3">
			<!-- Current Location Option -->
			<button
				on:click={handleGetCurrentLocation}
				disabled={$locationStore.loading}
				class="w-full flex items-center space-x-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<div class="flex-shrink-0">
					<MapPin class="h-5 w-5 text-gray-600" />
				</div>
				<div class="flex-1 text-left">
					<div class="font-medium">Ойр байгаа ресторанууд</div>
					{#if $locationStore.loading}
						<div class="text-sm text-gray-500">Байршил авч байна...</div>
					{/if}
				</div>
				<div class="flex-shrink-0">
					<div class="bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium">
						Хайх
					</div>
				</div>
			</button>


			<!-- Custom Address Input -->
			<div class="space-y-2">
				<input
					type="text"
					placeholder="Хаяг оруулах..."
					bind:value={customAddress}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
					on:keydown={(e) => {
						if (e.key === 'Enter') handleAddressSubmit();
					}}
				/>
				{#if customAddress.trim()}
					<button
						on:click={handleAddressSubmit}
						class="w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors"
					>
						Энэ хаягаар хайх
					</button>
				{/if}
			</div>
		</div>
	</div>
</Modal>

<style>
	/* Custom styles if needed */
</style>