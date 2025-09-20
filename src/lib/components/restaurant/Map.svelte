<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import 'leaflet/dist/leaflet.css';
	import type { LatLngExpression } from 'leaflet';
	import type { SearchResultItem } from '$lib/types/search';

	export let results: SearchResultItem[] = [];
	interface SimpleLocation {
		latitude: string;
		longitude: string;
		name: string;
	}
	
	let mapRestaurants = results
		.filter((item) => item.latitude && item.longitude)
		.map((item) => {	
		return  {
			id: item.id,
			latitude: Number(item.latitude),  
			longitude: Number(item.longitude),
			name: item.name,
			imageUrl: item.restaurant_img_urls?.[0] || '',
			rating: item.average_rating || 0,
			address: item.address || ''
		}

	});
	
	export let locations: SimpleLocation[] = [];
	export let zoom: number = 13;
	let displayRestaurants = mapRestaurants?.length > 0 
		? mapRestaurants 
		: locations.filter(loc => loc.latitude && loc.longitude && 
			!isNaN(Number(loc.latitude)) && !isNaN(Number(loc.longitude)))
			.map((loc, index) => ({
				id: `location-${index}`,
				latitude: Number(loc.latitude),
				longitude: Number(loc.longitude),
				name: loc.name,
				imageUrl: "",
				rating: 0,
				address: ""
			}));

	let mapElement: HTMLElement;
	let map: L.Map | null = null;
	let L: any = null;

	onMount(async () => {
		if (!browser) return;
		L = await import('leaflet');

		// Default Leaflet icon path configuration
		delete L.Icon.Default.prototype._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
			iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
			shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
		});

		initializeMap();
	});

	afterUpdate(() => {
		if (map && displayRestaurants.length > 0) {
			// Remove existing markers
			map.eachLayer((layer) => {
				if (layer instanceof L.Marker) {
					map?.removeLayer(layer);
				}
			});

			// Add new markers
			displayRestaurants.forEach((restaurant) => {
				if (restaurant.latitude && restaurant.longitude) {
					const customIcon = L.divIcon({
						className: 'custom-restaurant-marker',
						html: `
							<div class="marker-pin"></div>
						`,
						iconSize: [40, 40],
						iconAnchor: [20, 40]
					});

					const marker = L.marker([restaurant.latitude, restaurant.longitude], { icon: customIcon }).addTo(map);


					const tooltipContent = `
						<div class="restaurant-tooltip">
							${restaurant?.imageUrl ? `<img src="${restaurant.imageUrl}" alt="${restaurant.name}" class="tooltip-image" />` : ''}
							<div class="tooltip-content">
								<h3 class="tooltip-title">${restaurant.name}</h3>
								${restaurant.rating ? `<div class="tooltip-rating">⭐ ${restaurant.rating}</div>` : ''}
								${restaurant.address ? `<div class="tooltip-address">${restaurant.address}</div>` : ''}
							</div>
						</div>
					`;

					marker.bindPopup(tooltipContent, {
						closeOnClick: false,
						autoClose: false,
						closeButton: false,
						offset: [0, -15]
					});
					
					if (restaurant.id && !restaurant.id.startsWith('location-')) {
						marker.on('click', () => {
							goto(`/restaurant/${restaurant.id}`);
						});
					}

					let hoverTimeout: NodeJS.Timeout;
					marker.on('mouseover', () => {
						clearTimeout(hoverTimeout);
						marker.openPopup();
					});

					marker.on('mouseout', () => {
						hoverTimeout = setTimeout(() => {
							marker.closePopup();
						}, 100); 
					});

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

			if (displayRestaurants.length > 1) {
				const bounds = L.latLngBounds(displayRestaurants.map(restaurant => [restaurant.latitude, restaurant.longitude]));
				map.fitBounds(bounds, { padding: [50, 50] });
			} else if (displayRestaurants.length === 1) {
                map.setView([displayRestaurants[0].latitude, displayRestaurants[0].longitude], zoom);
            }
		}
	});

	function initializeMap() {
		if (mapElement && L && !map) {
			
			const initialCenter: LatLngExpression =
				displayRestaurants.length > 0 && displayRestaurants[0].latitude && displayRestaurants[0].longitude ? [displayRestaurants[0].latitude, displayRestaurants[0].longitude] : [47.9187, 106.917];

			map = L.map(mapElement).setView(initialCenter, zoom);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
		}
	}
</script>

<div bind:this={mapElement} style="height: 100%; min-height: 300px;" class="rounded-xl border border-gray-200 shadow-sm"></div>

<style>
	:global(.custom-restaurant-marker) {
		background: transparent;
		border: none;
	}

	:global(.marker-pin) {
		width: 32px;
		height: 32px;
		border-radius: 50% 50% 50% 0;
		background: #e53e3e;
		position: absolute;
		transform: rotate(-45deg);
		left: 50%;
		top: 50%;
		margin: -16px 0 0 -16px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	:global(.marker-pin::after) {
		content: '';
		width: 14px;
		height: 14px;
		margin: 3px 0 0 3px;
		background: #fff;
		position: absolute;
		border-radius: 50%;
	}

	:global(.marker-pin:hover) {
		transform: rotate(-45deg) scale(1.1);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
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