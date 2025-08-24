<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';


	let mapElement: HTMLElement;

	onMount(() => {
		const map = L.map(mapElement).setView([47.9187, 106.917], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.marker([47.9187, 106.917]).addTo(map);
	});
</script>

<div bind:this={mapElement} style="height: 400px" class="rounded-lg mt-6"></div>
