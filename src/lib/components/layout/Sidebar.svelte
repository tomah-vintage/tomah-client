<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X, User, Heart, Percent, HelpCircle, Settings, LogOut } from 'lucide-svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { authStore } from '$lib/stores/auth';

	export let show = false;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}
</script>

{#if show}
	<div class="fixed inset-0 z-40" on:click={close} style="background-color: rgba(0, 0, 0, 0.3);" />
{/if}
<div
	class="fixed top-0 left-0 z-50 flex h-full w-80 transform flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out {show
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<div class="flex items-center justify-between border-b p-4">
		{#if $authStore.isAuthenticated}
			<div class="flex items-center space-x-3 rounded-lg p-2">
				<User class="h-6 w-6 text-gray-600" />
				<span class="text-lg font-semibold">{$authStore.user?.first_name || 'User'}</span>
			</div>
		{/if}
		<button on:click={close} class="p-2">
			<X class="h-6 w-6" />
		</button>
	</div>
	<nav class="flex-grow p-4">
		<ul>
			<li>
				<a href="/" class="flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-gray-100">
					<Heart class="h-5 w-5 text-gray-600" />
					<span>Миний хадгалсан</span>
				</a>
			</li>
			<li>
				<a href="/" class="flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-gray-100">
					<Percent class="h-5 w-5 text-gray-600" />
					<span>Урамшуулал</span>
				</a>
			</li>
			<li>
				<a href="/" class="flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-gray-100">
					<HelpCircle class="h-5 w-5 text-gray-600" />
					<span>Тусламж</span>
				</a>
			</li>
			<li>
				<a href="/" class="flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-gray-100">
					<Settings class="h-5 w-5 text-gray-600" />
					<span>Тохиргоо</span>
				</a>
			</li>
		</ul>
		<hr class="my-4" />
	</nav>
	<div class="border-t p-4">
		{#if $authStore.isAuthenticated}
			<button
				on:click={() => authStore.logout()}
				class="flex w-full items-center space-x-3 rounded-lg px-4 py-2 text-red-600 hover:bg-gray-100"
			>
				<LogOut class="h-5 w-5" />
				<span>Гарах</span>
			</button>
		{:else}
			<div class="flex flex-col space-y-2">
				<Button
					on:click={() => dispatch('openLogin')}
					label="Нэвтрэх"
					variant="secondary"
					className="w-full"
				/>
				<Button
					on:click={() => dispatch('openRegister')}
					label="Бүртгүүлэх"
					variant="primary"
					className="w-full bg-red-600 hover:bg-red-700"
				/>
			</div>
		{/if}
	</div>
</div>
