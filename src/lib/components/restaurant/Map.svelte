<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	export let lat: number;
	export let lng: number;

	let mapElement: HTMLElement;

	onMount(() => {
		const map = L.map(mapElement).setView([lat, lng], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.marker([lat, lng]).addTo(map);
	});
</script>

<div bind:this={mapElement} style="height: 400px"></div>
