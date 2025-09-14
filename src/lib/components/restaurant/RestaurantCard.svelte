<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { Clock, MapPin, Heart, Star } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { getRestaurantHoursDisplay, getRestaurantStatus } from '$lib/utils/restaurant';
	import { authStore } from '$lib/stores/auth';
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import Modal from '$lib/components/common/Modal.svelte';

	export let restaurant: Restaurant;
	export let variant: 'carousel' | 'grid' = 'carousel'; // New prop to control layout
	export let className: string = '';

	let showLoginModal = false;
	let showRegisterModal = false;

	function activate() {
		goto(`/restaurant/${restaurant.id}`);
	}

	async function handleFavorite() {
		if ($authStore.isAuthenticated) {
			try {
				await apiFetch(`${env.PUBLIC_BACKEND_URL}/api/restaurant-like/`, {
					method: 'POST',
					body: JSON.stringify({ restaurant: restaurant.id })
				});
				// Optionally, update the UI to show the restaurant is favorited
			} catch (error) {
				console.error('Failed to favorite restaurant:', error);
			}
		} else {
			showLoginModal = true
		}
	}

	// Handle missing image gracefully
	$: imageUrl = restaurant.logo || restaurant.restaurant_img_urls?.[0] || '';
	$: hasImage = Boolean(imageUrl && imageUrl.trim());

	// Handle missing data gracefully
	$: displayName = restaurant.name || 'Restaurant';
	$: displayAddress = restaurant.address?.trim() || '';
	$: displayRating =
		(restaurant.rating || restaurant.average_rating) &&
		(restaurant.rating || restaurant.average_rating)! > 0
			? restaurant.rating || restaurant.average_rating
			: null;

	// Restaurant hours and status
	$: hoursDisplay = getRestaurantHoursDisplay(restaurant);
	$: status = getRestaurantStatus(restaurant);

	function handleOpenRegister() {
		showLoginModal = false;
		showRegisterModal = true;
	}

	function handleOpenLogin() {
		showRegisterModal = false;
		showLoginModal = true;
	}
</script>

<div
	class="restaurant-card focus:ring-primary-200 relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all
	duration-300 ease-out
	hover:shadow-lg focus:ring-0 focus:ring-offset-0 focus:outline-none
	{variant === 'carousel'
		? 'mb-3 flex h-[248px] w-[300px] flex-col'
		: 'flex min-h-[280px] w-full flex-col sm:min-h-[300px]'} {className}"
	role="button"
	tabindex="0"
	aria-label={`View ${displayName}`}
	on:click={activate}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			activate();
		}
	}}
>
	<!-- Image Container -->
	<div class="relative {variant === 'carousel' ? 'h-[152px]' : 'h-48 sm:h-52'} w-full">
		{#if hasImage}
			<img
				src={imageUrl}
				alt={restaurant.name}
				draggable="false"
				class="h-full w-full rounded-t-2xl object-cover"
				loading="lazy"
			/>
		{:else}
			<!-- Fallback for missing image -->
			<div class="flex h-full w-full items-center justify-center rounded-t-2xl bg-neutral-100">
				<div class="px-4 text-center">
					<div class="mb-2 text-4xl text-neutral-400">🍽️</div>
					<p class="line-clamp-2 text-sm font-medium text-neutral-500">{displayName}</p>
				</div>
			</div>
		{/if}

		<!-- Discount Badge -->
		{#if restaurant.discount}
			<div
				class="bg-primary absolute top-2 left-2 rounded-md px-2 py-1 text-xs font-medium text-white shadow-md"
			>
				-{restaurant.discount}%
			</div>
		{/if}

		<!-- Heart Icon -->
		<button
			class="group absolute top-2 right-2 rounded-full bg-white p-2 shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
			on:click|stopPropagation={handleFavorite}
			aria-label="Add to favorites"
		>
			<Heart
				size={20}
				class="group-hover:text-primary text-neutral-500 transition-colors duration-200"
			/>
		</button>

		<!-- Rating Badge -->
		{#if displayRating}
			<div
				class="absolute {variant === 'carousel'
					? 'top-[120px]'
					: 'top-[160px] sm:top-[180px]'} right-3 flex items-center rounded-full border border-white/20 bg-white/95 px-2.5 py-1 shadow-lg backdrop-blur-sm"
			>
				<Star size={14} class="mr-1 fill-current text-yellow-400" />
				<span class="text-sm font-semibold text-neutral-900">{displayRating}</span>
			</div>
		{/if}
	</div>

	<!-- Content Container -->
	<div class="flex flex-1 flex-col justify-between px-4 py-2">
		<div class="space-y-2">
			<h2 class="line-clamp-2 text-base leading-tight font-bold text-neutral-900">{displayName}</h2>

			<!-- Hours and Status -->
			<div class="flex items-center gap-1.5">
				<Clock size={14} class="flex-shrink-0 text-neutral-400" />
				<div class="flex min-w-0 flex-1 items-center gap-2">
					<span
						class="rounded-full px-2 py-0.5 text-xs font-semibold {status.isOpen
							? 'bg-green-100 text-green-700'
							: 'bg-red-100 text-red-700'}"
					>
						{status.text}
					</span>
					<span class="truncate text-sm text-neutral-600">
						{hoursDisplay}
					</span>
				</div>
			</div>

			{#if displayAddress}
				<div class="flex items-start gap-1.5">
					<MapPin size={14} class="mt-0.5 flex-shrink-0 text-neutral-400" />
					<p class="line-clamp-2 text-sm leading-relaxed text-neutral-600">
						{displayAddress}
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<Modal showModal={showLoginModal} on:close={() => (showLoginModal = false)}>
	<LoginForm on:openRegister={handleOpenRegister} on:close={() => (showLoginModal = false)} />
</Modal>

<Modal showModal={showRegisterModal} on:close={() => (showRegisterModal = false)}>
	<RegisterForm on:switchToLogin={handleOpenLogin} on:close={() => (showRegisterModal = false)} />
</Modal>