<script lang="ts">
	import { CheckCircle, AlertTriangle, LoaderCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import { ProfileImageUploader, ProfileForm, PasswordChangeForm } from '$lib/components/profile';
	import { ErrorPage, NotFoundPage } from '$lib/components/common';
	import { showProfileUpdateSuccess, showPasswordChangeSuccess } from '$lib/stores/successModal';

	let isSaving = false;
	let message = '';
	let messageType = 'success';

	let formData = {
		first_name: '',
		last_name: '',
		email: '',
		phone: ''
	};

	let passwordData = {
		new_password: '',
		confirm_password: ''
	};

	let errors: Record<string, string> = {};
	let selectedImage: File | null = null;
	let imagePreview: string | null = null;

	$: user = $authStore.user;

	onMount(async () => {
		if (!$authStore.user && !$authStore.loading) {
			await authStore.revalidate();
		}
	});

	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.first_name.trim()) {
			newErrors.first_name = 'Нэр заавал бөглөнө үү';
		}

		if (!formData.last_name.trim()) {
			newErrors.last_name = 'Овог заавал бөглөнө үү';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'И-мэйл заавал бөглөнө үү';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'И-мэйл хаяг буруу байна';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function validatePassword() {
		if (!passwordData.new_password && !passwordData.confirm_password) {
			return true;
		}

		if (passwordData.new_password.length < 6) {
			errors = { ...errors, password: 'Нууц үг дор хаяж 6 тэмдэгт байх ёстой' };
			return false;
		}

		if (passwordData.new_password !== passwordData.confirm_password) {
			errors = { ...errors, password: 'Нууц үг таарахгүй байна' };
			return false;
		}

		delete errors.password;
		return true;
	}

	function handleImageSelect(event: CustomEvent<File>) {
		selectedImage = event.detail;

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target?.result as string;
		};
		reader.readAsDataURL(selectedImage);

		// Clear any previous image errors
		if (errors.image) {
			const newErrors = { ...errors };
			delete newErrors.image;
			errors = newErrors;
		}
	}

	function handleImageError(event: CustomEvent<string>) {
		errors = { ...errors, image: event.detail };
		selectedImage = null;
		imagePreview = null;
	}

	async function handleProfileUpdate(event: CustomEvent<typeof formData>) {
		formData = event.detail;

		if (!validateForm()) return;

		isSaving = true;
		message = '';

		try {
			if (!user?.id) throw new Error('User not authenticated');

			// Upload image first if selected
			let profileImageUrl = null;
			if (selectedImage) {
				const imageFormData = new FormData();
				imageFormData.append('profile_image', selectedImage);

				const imageResponse = (await apiFetch(
					`${env.PUBLIC_BACKEND_URL}/api/upload/`,
					{
						method: 'POST',
						body: imageFormData
					},
					'file'
				)) as any;

				profileImageUrl = imageResponse.profile_image_url;
			}

			// Update profile data
			const updateData: any = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				email: formData.email,
				role: user.role
			};

			if (profileImageUrl) {
				updateData.profile_image = profileImageUrl;
			}

			await apiFetch(`${env.PUBLIC_BACKEND_URL}/api/users/${user.id}/`, {
				method: 'PUT',
				body: JSON.stringify(updateData)
			});

			// Clear selected image after successful upload
			selectedImage = null;
			imagePreview = null;

			await authStore.revalidate();
			showProfileUpdateSuccess();
		} catch (error) {
			console.error('Profile update failed:', error);
			message = 'Профайл шинэчлэхэд алдаа гарлаа';
			messageType = 'error';
		} finally {
			isSaving = false;
		}
	}

	async function handlePasswordChange(event: CustomEvent<typeof passwordData>) {
		passwordData = event.detail;

		if (!validatePassword()) return;
		if (!passwordData.new_password) return;

		isSaving = true;
		message = '';

		try {
			if (!user?.id) throw new Error('User not authenticated');

			await apiFetch(`${env.PUBLIC_BACKEND_URL}/api/users/${user.id}/change-password/`, {
				method: 'POST',
				body: JSON.stringify({
					new_password: passwordData.new_password
				})
			});

			passwordData = { new_password: '', confirm_password: '' };
			showPasswordChangeSuccess();
		} catch (error) {
			console.error('Password change failed:', error);
			message = 'Нууц үг солихоос алдаа гарлаа';
			messageType = 'error';
		} finally {
			isSaving = false;
		}
	}
</script>

{#if !$authStore.user && !$authStore.loading}
	<NotFoundPage
		title="Нэвтрэх шаардлагатай"
		message="Энэ хуудсанд хандахын тулд эхлээд нэвтэрнэ үү."
		showSearchButton={false}
	/>
{:else}
	<div class="container mx-auto max-w-[1200px] px-4 py-8">
		<div class="mx-auto my-8 w-full max-w-2xl rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Профайл тохиргоо</h2>
				{#if $authStore.loading}
					<LoaderCircle class="h-5 w-5 animate-spin text-gray-500" />
				{/if}
			</div>

			{#if message}
				<div
					class="mb-4 flex items-center rounded-lg p-3 {messageType === 'success'
						? 'border border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300'
						: 'border border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300'}"
				>
					{#if messageType === 'success'}
						<CheckCircle class="mr-2 h-4 w-4" />
					{:else}
						<AlertTriangle class="mr-2 h-4 w-4" />
					{/if}
					{message}
				</div>
			{/if}

			<ProfileImageUploader
				{user}
				{selectedImage}
				{imagePreview}
				{errors}
				on:imageSelect={handleImageSelect}
				on:imageError={handleImageError}
			/>

			<ProfileForm {user} {formData} {errors} {isSaving} on:submit={handleProfileUpdate} />

			<PasswordChangeForm {passwordData} {errors} {isSaving} on:submit={handlePasswordChange} />
		</div>
	</div>
{/if}
