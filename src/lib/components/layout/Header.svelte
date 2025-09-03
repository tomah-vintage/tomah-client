<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { cartStore } from '$lib/stores/cart';
	import Button from '$lib/components/common/Button.svelte';
	import { Menu, MapPin, Search, ShoppingCart } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import QpickTextLogo from '../assets/QpickTextLogo.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import RegisterForm from '$lib/components/auth/RegisterForm.svelte';

	let showLoginModal = false;
	let showRegisterModal = false;

	let searchTerm = '';
	function handleSearch() {
		goto(`/?search=${searchTerm}`);
	}
	function handleOpenRegister() {
		showLoginModal = false;
		showRegisterModal = true;
	}
	function handleOpenLogin() {
		showRegisterModal = false;
		showLoginModal = true;
	}

	$: totalItems = $cartStore.items.reduce((acc, item) => acc + item.quantity, 0);
</script>

<header class="bg-white p-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.15)]">
	<div class="container mx-auto flex items-center justify-between">
		<!-- Left Side -->
		<div class="flex items-center space-x-4">
			<button class="p-2 lg:hidden">
				<Menu class="h-6 w-6" />
			</button>
			<a href="/">
				<QpickTextLogo />
			</a>
		</div>

		<!-- Center -->
		<div class="hidden flex-1 items-center justify-center space-x-4 lg:flex">
			<button
				class="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-3 text-sm whitespace-nowrap"
			>
				<MapPin class="h-5 w-5 text-gray-500" />
				<span>Ойр байгаа байршил</span>
			</button>
			<div class="relative w-full max-w-lg">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<Search class="h-5 w-5 text-gray-400" />
				</div>
				<input
					type="text"
					placeholder="Хайл, Ресторан"
					class="w-full rounded-lg border-transparent bg-gray-100 py-3 pr-4 pl-10 focus:border-red-500 focus:ring-red-500"
					bind:value={searchTerm}
					on:keydown={(e) => {
						if (e.key === 'Enter') handleSearch();
					}}
				/>
			</div>
		</div>

		<!-- Right Side -->
		<div class="flex items-center space-x-2 sm:space-x-6">
			<div class="relative p-2">
				<a href="/order">
					<ShoppingCart class="h-6 w-6" />
					<span
						class="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
					>
						{totalItems}
					</span>
				</a>
			</div>

			{#if $authStore.loading}
				<div class="hidden items-center space-x-4 lg:flex">
					<div class="h-5 w-28 animate-pulse rounded bg-gray-200"></div>
				</div>
			{:else if $authStore.isAuthenticated}
				<div class="hidden items-center space-x-4 lg:flex">
					<span class="text-sm">Hello, {$authStore.user?.first_name || 'User'}</span>
				</div>
			{:else}
				<div class="hidden items-center space-x-4 lg:flex">
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
			<button class="p-2 lg:hidden">
				<Search class="h-6 w-6" />
			</button>
		</div>
	</div>
</header>

<Modal showModal={showLoginModal} on:close={() => (showLoginModal = false)}>
	<LoginForm on:openRegister={handleOpenRegister} on:close={() => (showLoginModal = false)} />
</Modal>

<Modal showModal={showRegisterModal} on:close={() => (showRegisterModal = false)}>
	<RegisterForm on:switchToLogin={handleOpenLogin} on:close={() => (showRegisterModal = false)} />
</Modal>

<style lang="postcss">
</style>
