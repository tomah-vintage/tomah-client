<script lang="ts">
	import { onMount } from 'svelte';
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

	// Reactive statement to add markers when both map and restaurants are ready
	$: if (map && displayRestaurants.length > 0) {
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
						<div class="marker-pin">
							<div class="marker-inner">
								<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
								</svg>
							</div>
						</div>
					`,
					iconSize: [48, 56],
					iconAnchor: [24, 56]
				});

				const marker = L.marker([restaurant.latitude, restaurant.longitude], { icon: customIcon }).addTo(map);

				const restaurantIdStr = String(restaurant.id);
				const tooltipContent = `
					<div class="restaurant-tooltip ${restaurant.id && !restaurantIdStr.startsWith('location-') ? 'clickable' : ''}">
						${restaurant?.imageUrl ? `<img src="${restaurant.imageUrl}" alt="${restaurant.name}" class="tooltip-image" />` : `<div class="tooltip-placeholder">🏪</div>`}
						<div class="tooltip-content">
							<h3 class="tooltip-title">${restaurant.name}</h3>
							${restaurant.rating && restaurant.rating > 0 ? `<div class="tooltip-rating">⭐ ${restaurant.rating.toFixed(1)}</div>` : ''}
							${restaurant.address ? `<div class="tooltip-address">📍 ${restaurant.address}</div>` : ''}
							${restaurant.id && !restaurantIdStr.startsWith('location-') ? '<div class="tooltip-action">Дэлгэрэнгүй үзэх</div>' : ''}
						</div>
					</div>
				`;

				marker.bindPopup(tooltipContent, {
					closeOnClick: false,
					autoClose: false,
					closeButton: false,
					offset: [0, -15]
				});
				
				if (restaurant.id && !restaurantIdStr.startsWith('location-')) {
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

						// Add click functionality to clickable tooltips
						const tooltipDiv = popupElement.querySelector('.restaurant-tooltip.clickable');
						if (tooltipDiv && restaurant.id && !restaurantIdStr.startsWith('location-')) {
							tooltipDiv.addEventListener('click', () => {
								goto(`/restaurant/${restaurant.id}`);
							});
						}
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

	function initializeMap() {
		if (mapElement && L && !map) {
			
			const initialCenter: LatLngExpression =
				displayRestaurants.length > 0 && displayRestaurants[0].latitude && displayRestaurants[0].longitude ? [displayRestaurants[0].latitude, displayRestaurants[0].longitude] : [47.9187, 106.917];

			map = L.map(mapElement).setView(initialCenter, zoom);

			// Use CartoDB Positron - clean, minimal but more lively than grayscale
			L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 19
			}).addTo(map);
		}
	}
</script>

<div bind:this={mapElement} style="height: 100%; min-height: 300px;" class="map-container rounded-xl border border-gray-200 shadow-sm"></div>

<style>
	.map-container {
		position: relative;
	}

	/* Apply subtle filter to map tiles to make pins stand out */
	:global(.map-container .leaflet-tile-pane) {
		filter: contrast(0.9) brightness(1.02) saturate(0.85);
	}

	/* Ensure map controls remain unfiltered */
	:global(.map-container .leaflet-control-container) {
		filter: none;
	}

	:global(.custom-restaurant-marker) {
		background: transparent;
		border: none;
	}

	:global(.marker-pin) {
		width: 40px;
		height: 48px;
		position: relative;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
	}

	:global(.marker-pin::before) {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #dc3545 100%);
		border-radius: 50% 50% 50% 0;
		transform: translateX(-50%) rotate(-45deg);
		border: 3px solid #ffffff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	:global(.marker-pin::after) {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 12px solid #dc3545;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
	}

	:global(.marker-inner) {
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 24px;
		height: 24px;
		background: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		color: #dc3545;
	}

	:global(.marker-inner svg) {
		width: 14px;
		height: 14px;
	}

	:global(.marker-pin:hover) {
		transform: scale(1.1) translateY(-2px);
		filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.25));
	}

	:global(.marker-pin:hover::before) {
		background: linear-gradient(135deg, #ff5252 0%, #f44336 50%, #d32f2f 100%);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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
		transition: all 0.2s ease;
	}

	:global(.restaurant-tooltip.clickable) {
		cursor: pointer;
	}

	:global(.restaurant-tooltip.clickable:hover) {
		background: #f8fafc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global(.tooltip-image) {
		width: 60px;
		height: 60px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
	}

	:global(.tooltip-placeholder) {
		width: 60px;
		height: 60px;
		border-radius: 8px;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
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
		display: flex;
		align-items: center;
		gap: 4px;
	}

	:global(.tooltip-action) {
		font-size: 12px;
		color: #3b82f6;
		margin: 6px 0 0 0;
		font-weight: 500;
		opacity: 0.8;
		transition: opacity 0.2s ease;
	}

	:global(.restaurant-tooltip.clickable:hover .tooltip-action) {
		opacity: 1;
	}

	:global(.leaflet-popup-tip) {
		background: white;
		border: none;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}
</style>