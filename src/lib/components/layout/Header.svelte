<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import Button from '$lib/components/common/Button.svelte';
	import { Menu, Search, ShoppingCart, Heart } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import QpickTextLogo from '../assets/QpickTextLogo.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import OTPLogin from '$lib/components/auth/OTPLogin.svelte';
	import OTPRegister from '$lib/components/auth/OTPRegister.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { cartQuantity } from '$lib/stores/cart';
	import { qrOrigin } from '$lib/stores/table';
	import OrderModel from '../order/OrderModel.svelte';
	import Orders from '../order/Orders.svelte';

	let showLoginModal = false;
	let showRegisterModal = false;
	let showSidebar = false;
	let showOrder = false;
	let showMobileSearch = false;

	let searchTerm = '';
	let debounceTimeout: NodeJS.Timeout;
	let isUserTyping = false;

	// Initialize search term from URL search params
	$: {
		const urlQuery = $page.url.searchParams.get('q') || '';
		// Only update if user is not actively typing and values are different
		if (!isUserTyping && urlQuery !== searchTerm) {
			searchTerm = urlQuery;
		}
	}

	function handleSearch(value: string) {
		isUserTyping = true;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			isUserTyping = false;
			const currentPath = $page.url.pathname;
			if (currentPath !== '/search') {
				goto(`/search?q=${value}`);
			} else {
				// If already on search page, update the URL to trigger new search
				// This will be handled by the reactive statement in +page.svelte
				goto(`/search?q=${value}`, { replaceState: true });
			}
		}, 300); // Debounce for 300ms
	}
	function handleOpenRegister() {
		showLoginModal = false;
		showRegisterModal = true;
		showSidebar = false;
	}
	function handleOpenLogin() {
		showRegisterModal = false;
		showLoginModal = true;
		showSidebar = false;
	}

	const openModal = () => (showOrder = true);
	const closeModal = () => (showOrder = false);

	// Handle logo click with QR origin redirect
	function handleLogoClick() {
		const qrUrl = qrOrigin.getRestaurantUrl();
		
		if (qrUrl) {
			console.log('QR origin found, navigating to:', qrUrl);
			goto(qrUrl);
		} else {
			console.log('No QR origin, going to home');
			goto('/');
		}
	}

	$: if (typeof document !== 'undefined') {
		document.body.classList.toggle('no-scroll', showSidebar || showMobileSearch);
	}
</script>

<header class="bg-[#EF3F3D] p-3 shadow-[0_2px_2px_0_rgba(0,0,0,0.15)] lg:bg-white lg:p-4">
	<div class="container mx-auto flex max-w-[1200px] items-center justify-between">
		<!-- Left Side -->
		<div class="flex items-center space-x-1 lg:space-x-4">
			<button
				on:click={() => (showSidebar = true)}
				class="cursor-pointer p-2.5 lg:p-0 lg:py-2 lg:pr-2"
			>
				<Menu class="h-6 w-6 text-white lg:text-black" />
			</button>
			<button on:click={handleLogoClick} class="cursor-pointer">
				<div class="hidden lg:flex">
					<QpickTextLogo />
				</div>
				<div class="h-9 w-24 md:hidden">
					<img alt="logo" src="/white-logo.png" />
				</div>
			</button>
		</div>

		<!-- Center -->
		<div class="hidden flex-1 items-center justify-center space-x-4 lg:flex">
			<!-- <button
				class="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-3 text-sm whitespace-nowrap"
			>
				<MapPin class="h-5 w-5 text-gray-500" />
				<span>Ойр байгаа байршил</span>
			</button> -->
			<div class="relative w-full max-w-lg">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<Search class="h-5 w-5 text-gray-400" />
				</div>
				<input
					type="text"
					placeholder="Хайл, Ресторан"
					class=" w-full rounded-lg border-2 border-transparent bg-neutral-100 py-3
					pr-4 pl-10 transition-all duration-200 hover:bg-neutral-50 focus:bg-white focus:ring-0"
					bind:value={searchTerm}
					on:input={() => handleSearch(searchTerm)}
					on:focus={() => (isUserTyping = true)}
					on:keydown={(e) => {
						if (e.key === 'Enter') handleSearch(searchTerm);
					}}
				/>
			</div>
		</div>

		<!-- Right Side -->
		<div class="flex items-center space-x-1 lg:space-x-6">
			<!-- Heart/Favorites icon - mobile only -->
			<button class="p-2.5 lg:hidden" on:click={() => goto('/saved')}>
				<Heart class="h-6 w-6 text-white" />
			</button>

			<!-- Cart -->
			<div class="relative p-2.5 lg:p-2">
				<button on:click={openModal}>
					<ShoppingCart class="h-6 w-6 text-white lg:text-black" />
					<span
						class="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-red-600 lg:bg-red-500 lg:text-white"
					>
						{$cartQuantity}
					</span>
				</button>
			</div>

			{#if $authStore.loading}
				<div class="mr-0 hidden items-center space-x-4 lg:flex">
					<div class="h-5 w-28 animate-pulse rounded bg-gray-200"></div>
				</div>
			{:else if $authStore.isAuthenticated}
				<div class="mr-0 hidden items-center space-x-4 lg:flex">
					<span class="text-sm">Hello, {$authStore.user?.first_name || 'User'}</span>
				</div>
			{:else}
				<div class="mr-0 hidden items-center space-x-4 lg:flex">
					<button
						on:click={() => (showLoginModal = true)}
						class="cursor-pointer text-sm font-medium whitespace-nowrap hover:text-red-600"
						>Нэвтрэх</button
					>
					<Button
						on:click={() => (showRegisterModal = true)}
						label="Бүртгүүлэх"
						variant="primary"
						className="whitespace-nowrap bg-red-600 px-4 py-2 text-sm hover:bg-red-700"
					/>
				</div>
			{/if}
			<button
				class="rounded-lg p-2.5 transition-colors hover:bg-red-600 lg:hidden"
				on:click={() => (showMobileSearch = !showMobileSearch)}
				aria-label="Toggle mobile search"
			>
				<Search class="h-6 w-6 text-white" />
			</button>
		</div>
	</div>
</header>

<!-- Mobile Search Overlay -->
{#if showMobileSearch}
	<div
		class="fixed inset-0 z-50 bg-black/50 lg:hidden"
		on:click={() => (showMobileSearch = false)}
		role="button"
		tabindex="-1"
		on:keydown={(e) => {
			if (e.key === 'Escape') showMobileSearch = false;
		}}
	>
		<div
			class="absolute top-0 right-0 left-0 bg-white p-4 shadow-lg"
			on:click|stopPropagation
			role="dialog"
			aria-label="Mobile search"
		>
			<div class="flex items-center gap-3">
				<div class="relative flex-1">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Search class="h-5 w-5 text-neutral-400" />
					</div>
					<input
						type="text"
						placeholder="Хайл, Ресторан"
						class="focus:border-primary focus:ring-primary-200 w-full rounded-lg border-2 border-transparent bg-neutral-100 py-3
						pr-4 pl-10 transition-all duration-200 focus:bg-white focus:ring-2"
						bind:value={searchTerm}
						on:input={() => handleSearch(searchTerm)}
						on:focus={() => (isUserTyping = true)}
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								handleSearch(searchTerm);
								showMobileSearch = false;
							}
						}}
						autofocus
					/>
				</div>
				<button
					class="px-4 py-3 text-neutral-600 transition-colors hover:text-neutral-800"
					on:click={() => (showMobileSearch = false)}
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<Modal showModal={showLoginModal} on:close={() => (showLoginModal = false)}>
	<OTPLogin on:openRegister={handleOpenRegister} on:close={() => (showLoginModal = false)} />
</Modal>

<Modal showModal={showRegisterModal} on:close={() => (showRegisterModal = false)}>
	<OTPRegister on:switchToLogin={handleOpenLogin} on:close={() => (showRegisterModal = false)} />
</Modal>

<OrderModel open={showOrder} onClose={closeModal}>
	<Orders onClose={closeModal} />
</OrderModel>

<Sidebar
	show={showSidebar}
	on:close={() => (showSidebar = false)}
	on:openLogin={handleOpenLogin}
	on:openRegister={handleOpenRegister}
/>

<style lang="postcss">
</style>
