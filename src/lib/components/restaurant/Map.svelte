<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import 'leaflet/dist/leaflet.css';
	import type { LatLngExpression } from 'leaflet';

	interface Restaurant {
		id: string;
		lat: number;
		lng: number;
		name: string;
		imageUrl?: string;
		rating?: number;
		address?: string;
	}

	interface SimpleLocation {
		lat: number;
		lng: number;
		name: string;
	}

	export let restaurants: Restaurant[] = [];
	export let locations: SimpleLocation[] = []; // For backwards compatibility
	export let zoom: number = 13;

	// Convert locations to restaurants format for internal use
	$: displayRestaurants = restaurants.length > 0 
		? restaurants 
		: locations.map((loc, index) => ({
			id: `location-${index}`,
			lat: loc.lat,
			lng: loc.lng,
			name: loc.name
		}));

	let mapElement: HTMLElement;
	let map: L.Map | null = null;
	let L: any = null;
	let tooltipElement: HTMLElement;

	onMount(async () => {
		if (!browser) return;
		L = await import('leaflet');
		initializeMap();
	});

	afterUpdate(() => {
		if (map && displayRestaurants) {
			// Clear existing markers
			map.eachLayer((layer) => {
				if (layer instanceof L.Marker) {
					map.removeLayer(layer);
				}
			});

			// Add new markers
			displayRestaurants.forEach((restaurant) => {
				if (restaurant.lat && restaurant.lng) {
					// Create custom icon
					const customIcon = L.divIcon({
						className: 'custom-restaurant-marker',
						html: `
							<div class="marker-pin">
								<div class="marker-icon">🍽️</div>
							</div>
						`,
						iconSize: [40, 40],
						iconAnchor: [20, 40]
					});

					const marker = L.marker([restaurant.lat, restaurant.lng], { icon: customIcon })
						.addTo(map);

					// Create custom tooltip content
					const tooltipContent = `
						<div class="restaurant-tooltip">
							${restaurant.imageUrl ? `<img src="${restaurant.imageUrl}" alt="${restaurant.name}" class="tooltip-image" />` : ''}
							<div class="tooltip-content">
								<h3 class="tooltip-title">${restaurant.name}</h3>
								${restaurant.rating ? `<div class="tooltip-rating">⭐ ${restaurant.rating}</div>` : ''}
								${restaurant.address ? `<div class="tooltip-address">${restaurant.address}</div>` : ''}
							</div>
						</div>
					`;

					// Bind popup and events
					const popup = marker.bindPopup(tooltipContent, {
						closeOnClick: false,
						autoClose: false,
						closeButton: false,
						offset: [0, -15]
					});
					
					// Add click event to navigate to restaurant (only if it's a real restaurant with valid id)
					if (restaurant.id && !restaurant.id.startsWith('location-')) {
						marker.on('click', () => {
							goto(`/restaurant/${restaurant.id}`);
						});
					}

					let hoverTimeout: NodeJS.Timeout;

					// Add hover events for marker
					marker.on('mouseover', (e) => {
						clearTimeout(hoverTimeout);
						marker.openPopup();
					});

					marker.on('mouseout', (e) => {
						hoverTimeout = setTimeout(() => {
							marker.closePopup();
						}, 100); // Small delay to allow moving to tooltip
					});

					// Add hover events for popup content
					marker.on('popupopen', () => {
						const popupElement = marker.getPopup()?.getElement();
						if (popupElement) {
							popupElement.addEventListener('mouseenter', () => {
								clearTimeout(hoverTimeout);
							});
							
							popupElement.addEventListener('mouseleave', () => {
								marker.closePopup();
							});
						}
					});
				}
			});

			// Adjust map view
			if (displayRestaurants.length > 1) {
				const bounds = L.latLngBounds(displayRestaurants.map(restaurant => [restaurant.lat, restaurant.lng]));
				map.fitBounds(bounds, { padding: [50, 50] });
			} else if (displayRestaurants.length === 1) {
                map.setView([displayRestaurants[0].lat, displayRestaurants[0].lng], zoom);
            }
		}
	});

	function initializeMap() {
		if (mapElement && L && !map) {
			const initialCenter: LatLngExpression =
				displayRestaurants.length > 0 && displayRestaurants[0].lat && displayRestaurants[0].lng ? [displayRestaurants[0].lat, displayRestaurants[0].lng] : [47.9187, 106.917];

			map = L.map(mapElement).setView(initialCenter, zoom);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
		}
	}
</script>

<div bind:this={mapElement} style="height: 100%; min-height: 500px;" class="rounded-lg"></div>

<style>
	:global(.custom-restaurant-marker) {
		background: transparent;
		border: none;
	}

	:global(.marker-pin) {
		width: 40px;
		height: 40px;
		border-radius: 50% 50% 50% 0;
		background: #e53e3e;
		position: absolute;
		transform: rotate(-45deg);
		left: 50%;
		top: 50%;
		margin: -20px 0 0 -20px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	:global(.marker-pin:hover) {
		transform: rotate(-45deg) scale(1.1);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
	}

	:global(.marker-icon) {
		width: 24px;
		height: 24px;
		font-size: 16px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%) rotate(45deg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	:global(.leaflet-popup-content-wrapper) {
		border-radius: 12px;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
		border: none;
	}

	:global(.leaflet-popup-content) {
		margin: 0;
		padding: 0;
		min-width: 200px;
	}

	:global(.restaurant-tooltip) {
		display: flex;
		gap: 12px;
		align-items: center;
		padding: 12px;
		background: white;
		border-radius: 8px;
	}

	:global(.tooltip-image) {
		width: 60px;
		height: 60px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
	}

	:global(.tooltip-content) {
		flex: 1;
		min-width: 0;
	}

	:global(.tooltip-title) {
		font-weight: 600;
		font-size: 16px;
		margin: 0 0 4px 0;
		color: #1f2937;
		line-height: 1.2;
	}

	:global(.tooltip-rating) {
		font-size: 14px;
		color: #f59e0b;
		margin: 2px 0;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	:global(.tooltip-address) {
		font-size: 12px;
		color: #6b7280;
		margin: 2px 0 0 0;
		line-height: 1.3;
	}

	:global(.leaflet-popup-tip) {
		background: white;
		border: none;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}
</style>