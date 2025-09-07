<script lang="ts">
	import { Camera } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import type { User } from '$lib/types/user';

	export let user: User | null;
	export let selectedImage: File | null = null;
	export let imagePreview: string | null = null;
	export let errors: Record<string, string> = {};

	const dispatch = createEventDispatcher<{
		imageSelect: File;
		imageError: string;
	}>();

	let fileInput: HTMLInputElement;

	function handleImageSelect() {
		fileInput.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (file) {
			// Validate file type
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
			if (!allowedTypes.includes(file.type)) {
				dispatch('imageError', 'Зөвхөн JPG, PNG, WEBP форматын зураг боломжтой');
				return;
			}
			
			// Validate file size (5MB)
			if (file.size > 5 * 1024 * 1024) {
				dispatch('imageError', 'Зургийн хэмжээ 5MB-аас бага байх ёстой');
				return;
			}
			
			dispatch('imageSelect', file);
		}
	}

	function getDisplayName(): string {
		if (user?.first_name && user?.last_name) {
			return `${user.first_name} ${user.last_name}`;
		}
		return user?.email || 'User';
	}

	function getInitials(): string {
		if (user?.first_name && user?.last_name) {
			return `${user.first_name[0]?.toUpperCase() || 'U'}${user.last_name[0]?.toUpperCase() || ''}`;
		}
		return 'U';
	}
</script>

<!-- Hidden file input -->
<input
	type="file"
	accept="image/jpeg,image/jpg,image/png,image/webp"
	class="hidden"
	bind:this={fileInput}
	on:change={handleFileChange}
/>

<div class="mb-8 flex items-center space-x-4">
	<div class="relative">
		<!-- Profile Image -->
		{#if imagePreview}
			<img
				src={imagePreview}
				alt="Profile preview"
				class="h-20 w-20 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
			/>
		{:else if user?.profile_image}
			<img
				src={user.profile_image}
				alt="Profile"
				class="h-20 w-20 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
			/>
		{:else}
			<div class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xl font-semibold text-white">
				{getInitials()}
			</div>
		{/if}
		
		<!-- Upload button -->
		<button
			type="button"
			on:click={handleImageSelect}
			class="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
			title="Зураг солих"
		>
			<Camera class="h-3 w-3" />
		</button>
	</div>
	
	<div class="flex-1">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
			{getDisplayName()}
		</h3>
		<p class="text-sm text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
		
		{#if selectedImage}
			<p class="mt-1 text-sm text-green-600 dark:text-green-400">
				Шинэ зураг сонгогдлоо: {selectedImage.name}
			</p>
		{/if}
		
		{#if errors.image}
			<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
		{/if}
	</div>
</div>