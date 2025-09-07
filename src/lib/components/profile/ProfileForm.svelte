<script lang="ts">
	import { Save, LoaderCircle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import type { User } from '$lib/types/user';

	export let user: User | null;
	export let formData = {
		first_name: '',
		last_name: '',
		email: '',
		phone: ''
	};
	export let errors: Record<string, string> = {};
	export let isSaving = false;

	const dispatch = createEventDispatcher<{
		submit: typeof formData;
	}>();

	// Update form data when user changes
	$: if (user && !formData.first_name && !formData.last_name && !formData.email) {
		formData = {
			first_name: user.first_name || '',
			last_name: user.last_name || '',
			email: user.email || '',
			phone: user.phone || ''
		};
	}

	function handleSubmit() {
		dispatch('submit', formData);
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="mb-8">
	<div class="mb-6">
		<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Хувийн мэдээлэл</h3>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Овог <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="last-name"
					bind:value={formData.last_name}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-red-500 dark:focus:bg-gray-600 {errors.last_name ? 'border-red-500 focus:border-red-500' : ''}"
					placeholder="Овогоо оруулна уу"
				/>
				{#if errors.last_name}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>
				{/if}
			</div>
			<div>
				<label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Нэр <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="first-name"
					bind:value={formData.first_name}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-red-500 dark:focus:bg-gray-600 {errors.first_name ? 'border-red-500 focus:border-red-500' : ''}"
					placeholder="Нэрээ оруулна уу"
				/>
				{#if errors.first_name}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>
				{/if}
			</div>
			<div class="md:col-span-2">
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					И-мэйл хаяг <span class="text-red-500">*</span>
				</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-red-500 dark:focus:bg-gray-600 {errors.email ? 'border-red-500 focus:border-red-500' : ''}"
					placeholder="И-мэйл хаягаа оруулна уу"
				/>
				{#if errors.email}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex justify-end">
		<button
			type="submit"
			disabled={isSaving}
			class="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
		>
			{#if isSaving}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<Save class="mr-2 h-4 w-4" />
			{/if}
			Хадгалах
		</button>
	</div>
</form>