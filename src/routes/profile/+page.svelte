<script>
	import { Camera, Eye, EyeOff } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let showPassword = false;
	let showConfirmPassword = false;

	// function togglePasswordVisibility(field) {
	// 	if (field === 'password') {
	// 		showPassword = !showPassword;
	// 	} else if (field === 'confirmPassword') {
	// 		showConfirmPassword = !showConfirmPassword;
	// 	}
	// }

	function handleContinue() {
		// Dispatch an event or perform an action on continue
		dispatch('continue');
	}

	function handlePasswordChange() {
		// Dispatch an event or perform an action on password change
		dispatch('password-change');
	}

	function handleClose() {
		// Dispatch a close event
		dispatch('close');
	}
</script>

<div class="mx-auto w-[600px] rounded-lg p-8">
	<h2 class="mb-6 text-start text-2xl font-bold text-gray-800">Тохиргоо</h2>

	<div class="mb-6 flex items-start justify-start">
		<div class="relative">
			<img
				src="/src/lib/assets/logo.png"
				alt="Profile"
				class="h-24 w-24 rounded-full border-4 border-gray-300 object-cover dark:border-gray-600"
			/>
			<div
				class="absolute right-0 bottom-0 rounded-full border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-700"
			>
				<Camera class="h-4 w-4 text-gray-600 dark:text-gray-400" />
			</div>
		</div>
	</div>

	<div class="mb-8 grid grid-cols-2 gap-4">
		<div>
			<label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Овог</label
			>
			<input
				type="text"
				id="last-name"
				class="mt-1 block w-full rounded-md border border-gray-700 p-2 px-4"
				value="Baymbaa"
			/>
		</div>
		<div>
			<label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Нэр</label
			>
			<input
				type="text"
				id="first-name"
				class="mt-1 block w-full rounded-md border border-gray-700 p-2 px-4"
				value="Tungaa"
			/>
		</div>
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Имэйл</label
			>
			<input
				type="email"
				id="email"
				class="mt-1 block w-full rounded-md border border-gray-700 p-2 px-4"
				value="Tungaa@gmail.com"
			/>
		</div>
		<div>
			<label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Утас</label
			>
			<input
				type="tel"
				id="phone"
				class="mt-1 block w-full rounded-md border border-gray-700 p-2 px-4"
				value="99090899"
			/>
		</div>
	</div>

	<div class="flex w-full justify-end">
		<button
			on:click={handleContinue}
			class="w-1/2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
		>
			Үргэлжлүүлэх
		</button>
	</div>

	<div class="relative my-8">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
		</div>
		<div class="relative flex justify-center text-sm">
			<span
				class="bg-white px-2 text-lg font-bold text-gray-800 dark:bg-gray-800 dark:text-gray-200"
			>
				Нууц үг сэргээх
			</span>
		</div>
	</div>

	<div class="mb-4 grid grid-cols-2 gap-4">
		<div class="relative">
			<label for="new-password" class="sr-only">Шинэ нууц үг</label>
			<input
				type={showPassword ? 'text' : 'password'}
				id="new-password"
				placeholder="Шинэ нууц үг"
				class="mt-1 block w-full rounded-md border border-gray-700 p-2 px-4"
			/>
			<!-- <div
				class="absolute right-0 flex cursor-pointer items-center pr-3"
				on:click={() => togglePasswordVisibility('password')}
			>
				{#if showPassword}
					<EyeOff class="h-5 w-5 text-gray-400" />
				{:else}
					<Eye class="h-5 w-5 text-gray-400" />
				{/if}
			</div> -->
		</div>
		<div class="relative">
			<label for="confirm-password" class="sr-only">Нууц үг дахин оруулана уу</label>
			<input
				type={showConfirmPassword ? 'text' : 'password'}
				id="confirm-password"
				placeholder="Нууц үг дахин оруулана уу"
				class="mt-1 block w-full rounded-md border border-gray-700 p-2 px-4"
			/>
			<!-- <div
				class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
				on:click={() => togglePasswordVisibility('confirmPassword')}
			>
				{#if showConfirmPassword}
					<EyeOff class="h-5 w-5 text-gray-400" />
				{:else}
					<Eye class="h-5 w-5 text-gray-400" />
				{/if}
			</div> -->
		</div>
	</div>

	<div class="flex w-full justify-end">
		<button
			on:click={handlePasswordChange}
			class="w-1/2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
		>
			Үргэлжлүүлэх
		</button>
	</div>
</div>
