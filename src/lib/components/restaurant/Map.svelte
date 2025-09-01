<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import 'leaflet/dist/leaflet.css';


	let mapElement: HTMLElement;

	onMount(async () => {
		// Only run on client side
		if (!browser) return;
		
		// Dynamically import Leaflet only on client side
		const L = await import('leaflet');
		
		const map = L.default.map(mapElement).setView([47.9187, 106.917], 13);

		L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.default.marker([47.9187, 106.917]).addTo(map);
	});
</script>

<div bind:this={mapElement} style="height: 400px" class="rounded-lg mt-6"></div>
