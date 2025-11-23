<script lang="ts">
	import TimeSelectionModal from '$lib/components/order/TimeSelectionModal.svelte';
	import NearbyBranchesModal from '$lib/components/location/NearbyBranchesModal.svelte';
	import {
		successModalStore,
		showRegistrationSuccess,
		showPasswordChangeSuccess,
		showProfileUpdateSuccess
	} from '$lib/stores/successModal';
	import type { Restaurant } from '$lib/types/restaurant';

	// Time Selection Modal
	let showTimeModal = false;
	let selectedSchedule: any = null;

	// Nearby Branches Modal
	let showBranchesModal = false;
	let userLocation = { latitude: 47.9184, longitude: 106.9177 }; // UB coordinates

	// Sample branches data
	let branches: Restaurant[] = [
		{
			id: '1',
			name: 'QPick Central Branch',
			address: 'Чингисийн өргөн чөлөө 33/5',
			logo: '',
			latitude: '47.9184',
			longitude: '106.9177',
			restaurant_img_urls: [],
			is_liked: false,
			open_hours: []
		},
		{
			id: '2',
			name: 'QPick East Branch',
			address: 'Баянзүрх дүүрэг, 20-р хороо',
			logo: '',
			latitude: '47.9250',
			longitude: '106.9400',
			restaurant_img_urls: [],
			is_liked: false,
			open_hours: []
		},
		{
			id: '3',
			name: 'QPick West Branch',
			address: 'Сонгинохайрхан дүүрэг',
			logo: '',
			latitude: '47.9150',
			longitude: '106.8900',
			restaurant_img_urls: [],
			is_liked: false,
			open_hours: []
		}
	];

	function handleTimeConfirm(event: CustomEvent) {
		selectedSchedule = event.detail;
	}

	function handleBranchSelect(event: CustomEvent) {
		const branch = event.detail;
		alert(`Selected: ${branch.name}`);
	}
</script>

<svelte:head>
	<title>Feature Testing - QPick</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">🧪 Feature Testing Page</h1>

	<div class="space-y-6">
		<!-- Time Selection Modal -->
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">⏰ Time Selection Modal</h2>
			<p class="mb-4 text-gray-600">Test the order scheduling feature</p>

			<button
				on:click={() => (showTimeModal = true)}
				class="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
			>
				Open Time Selection
			</button>

			{#if selectedSchedule}
				<div class="mt-4 rounded-lg bg-green-50 p-4">
					<p class="font-medium text-green-800">Selected:</p>
					<pre class="mt-2 text-sm text-green-700">{JSON.stringify(selectedSchedule, null, 2)}</pre>
				</div>
			{/if}
		</div>

		<!-- Nearby Branches Modal -->
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">📍 Nearby Branches Modal</h2>
			<p class="mb-4 text-gray-600">Test the branch selection feature</p>

			<div class="mb-4 space-y-2">
				<button
					on:click={() => {
						userLocation = { latitude: 47.9184, longitude: 106.9177 };
						showBranchesModal = true;
					}}
					class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					Open with Location
				</button>

				<button
					on:click={() => {
						userLocation = null as any;
						showBranchesModal = true;
					}}
					class="ml-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					Open without Location
				</button>
			</div>

			<p class="text-sm text-gray-500">
				Current location: {userLocation
					? `${userLocation.latitude}, ${userLocation.longitude}`
					: 'Not set'}
			</p>
		</div>

		<!-- Success Modals -->
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">✨ Success Modals</h2>
			<p class="mb-4 text-gray-600">Test the success notification modals</p>

			<div class="grid grid-cols-2 gap-3">
				<button
					on:click={showRegistrationSuccess}
					class="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
				>
					Registration Success
				</button>

				<button
					on:click={showPasswordChangeSuccess}
					class="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
				>
					Password Changed
				</button>

				<button
					on:click={showProfileUpdateSuccess}
					class="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
				>
					Profile Updated
				</button>

				<button
					on:click={() =>
						successModalStore.show({
							title: 'Custom Success Message!',
							buttonText: 'Cool!',
							autoClose: false
						})}
					class="rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700"
				>
					Custom Modal
				</button>
			</div>
		</div>

		<!-- Navigation -->
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
			<h3 class="mb-3 text-lg font-semibold text-gray-800">🔗 Quick Links</h3>
			<div class="space-y-2">
				<a href="/" class="block text-blue-600 hover:underline">← Back to Home</a>
				<a href="/about" class="block text-blue-600 hover:underline">View About Page</a>
				<a href="/orders" class="block text-blue-600 hover:underline"
					>View Orders (for E-Receipt test)</a
				>
				<a href="/profile" class="block text-blue-600 hover:underline"
					>View Profile (Success Modal integrated)</a
				>
			</div>
		</div>
	</div>
</div>

<!-- Modals -->
<TimeSelectionModal
	bind:showModal={showTimeModal}
	restaurantHours={{ open: '09:00', close: '22:00' }}
	on:close={() => (showTimeModal = false)}
	on:confirm={handleTimeConfirm}
/>

<NearbyBranchesModal
	bind:showModal={showBranchesModal}
	{branches}
	{userLocation}
	on:close={() => (showBranchesModal = false)}
	on:select={handleBranchSelect}
/>
