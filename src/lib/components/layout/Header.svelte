<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth';
	import { cartStore } from '$lib/stores/cart';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Icon from '$lib/components/common/Icon.svelte';
	import { Search, ShoppingCart } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.png';

	let searchTerm = '';

	function handleSearch() {
		goto(`/?search=${searchTerm}`);
	}

	function handleLogout() {
		authStore.logout();
	}

	$: totalItems = $cartStore.items.reduce((acc, item) => acc + item.quantity, 0);
</script>

<header class="bg-primary-dark p-4 shadow-md">
	<div class="container mx-auto flex items-center justify-between">
		<a href="/" class="text-accent-light flex items-center text-2xl font-bold">
			<img src={logo} alt="Tomah Logo" class="mr-2 h-10 w-24" />
		</a>

		<!-- <nav class="hidden md:flex space-x-4">
      <a href="/menu" class="hover:text-accent-light">Menu</a>
      <a href="/order" class="hover:text-accent-light">Orders</a>
    </nav> -->
		<div class="flex items-center space-x-4">
			<div class="relative flex items-center rounded-md border border-gray-300 px-3">
				<Input
					type="text"
					placeholder="Search..."
					label={undefined}
					bind:value={searchTerm}
					on:keydown={(e) => {
						const ke = e as unknown as KeyboardEvent;
						if (ke.key === 'Enter') handleSearch();
					}}
					className="border-none bg-transparent focus:ring-0 focus:outline-none  w-full"
				/>
				<Icon icon={Search} size={20} color="gray" />
			</div>

			<a href="/order" class="relative">
				<Icon icon={ShoppingCart} size={24} color="white" />
				{#if totalItems > 0}
					<span
						class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
					>
						{totalItems}
					</span>
				{/if}
			</a>

			{#if $authStore.isAuthenticated}
				<span class="text-sm">Hello, {$authStore.user?.name || 'User'}</span>
				<Button label="Logout" on:click={handleLogout} variant="secondary" />
			{:else}
				<a href="/auth/login"><Button label="Login" variant="secondary" /></a>
				<a href="/auth/register"><Button label="Register" variant="primary" /></a>
			{/if}
		</div>
	</div>
</header>

<style lang="postcss">
</style>
