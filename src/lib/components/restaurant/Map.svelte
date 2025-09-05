<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import 'leaflet/dist/leaflet.css';
	import type { LatLngExpression } from 'leaflet';

	export let locations: { lat: number; lng: number; name: string }[] = [];
	export let zoom: number = 13;

	let mapElement: HTMLElement;
	let map: L.Map | null = null;
	let L: any = null;

	onMount(async () => {
		if (!browser) return;
		L = await import('leaflet');
		initializeMap();
	});

	afterUpdate(() => {
		if (map && locations) {
			// Clear existing markers
			map.eachLayer((layer) => {
				if (layer instanceof L.Marker) {
					map.removeLayer(layer);
				}
			});

			// Add new markers
			locations.forEach((loc) => {
				if (loc.lat && loc.lng) {
					L.marker([loc.lat, loc.lng]).addTo(map).bindPopup(loc.name);
				}
			});

			// Adjust map view
			if (locations.length > 1) {
				const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
				map.fitBounds(bounds, { padding: [50, 50] });
			} else if (locations.length === 1) {
                map.setView([locations[0].lat, locations[0].lng], zoom);
            }
		}
	});

	function initializeMap() {
		if (mapElement && L && !map) {
			const initialCenter: LatLngExpression =
				locations.length > 0 && locations[0].lat && locations[0].lng ? [locations[0].lat, locations[0].lng] : [47.9187, 106.917];

			map = L.map(mapElement).setView(initialCenter, zoom);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
		}
	}
</script>

<div bind:this={mapElement} style="height: 100%; min-height: 500px;" class="rounded-lg"></div>