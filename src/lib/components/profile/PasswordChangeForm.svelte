<script lang="ts">
	import { Eye, EyeOff, Save, LoaderCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let passwordData = {
		new_password: '',
		confirm_password: ''
	};
	export let errors: Record<string, string> = {};
	export let isSaving = false;

	let showPassword = false;
	let showConfirmPassword = false;

	const dispatch = createEventDispatcher<{
		submit: typeof passwordData;
	}>();

	function togglePasswordVisibility(field: string) {
		if (field === 'password') {
			showPassword = !showPassword;
		} else if (field === 'confirmPassword') {
			showConfirmPassword = !showConfirmPassword;
		}
	}

	function handleSubmit() {
		dispatch('submit', passwordData);
	}
</script>

<div class="relative my-8">
	<div class="absolute inset-0 flex items-center">
		<div class="w-full border-t border-gray-200 dark:border-gray-600"></div>
	</div>
	<div class="relative flex justify-center">
		<span class="bg-white px-4 text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
			Нууц үг солих
		</span>
	</div>
</div>

<form on:submit|preventDefault={handleSubmit} class="mb-6">
	<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="relative">
			<label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Шинэ нууц үг
			</label>
			<input
				type={showPassword ? 'text' : 'password'}
				id="new-password"
				bind:value={passwordData.new_password}
				placeholder="Шинэ нууц үг оруулна уу"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 pr-10 text-sm text-gray-900 transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-red-500 dark:focus:bg-gray-600 {errors.password ? 'border-red-500 focus:border-red-500' : ''}"
			/>
			<button
				type="button"
				class="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
				on:click={() => togglePasswordVisibility('password')}
			>
				{#if showPassword}
					<EyeOff class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
				{:else}
					<Eye class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
				{/if}
			</button>
		</div>
		<div class="relative">
			<label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
				Нууц үг баталгаажуулах
			</label>
			<input
				type={showConfirmPassword ? 'text' : 'password'}
				id="confirm-password"
				bind:value={passwordData.confirm_password}
				placeholder="Нууц үгээ дахин оруулна уу"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 pr-10 text-sm text-gray-900 transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-red-500 dark:focus:bg-gray-600 {errors.password ? 'border-red-500 focus:border-red-500' : ''}"
			/>
			<button
				type="button"
				class="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
				on:click={() => togglePasswordVisibility('confirmPassword')}
			>
				{#if showConfirmPassword}
					<EyeOff class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
				{:else}
					<Eye class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
				{/if}
			</button>
		</div>
	</div>
	{#if errors.password}
		<p class="mb-4 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
	{/if}

	<div class="flex justify-end">
		<button
			type="submit"
			disabled={isSaving || (!passwordData.new_password && !passwordData.confirm_password)}
			class="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
		>
			{#if isSaving}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<Save class="mr-2 h-4 w-4" />
			{/if}
			Нууц үг солих
		</button>
	</div>
</form>