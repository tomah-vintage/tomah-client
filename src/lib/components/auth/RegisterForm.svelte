<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';
	import { X } from 'lucide-svelte';

	import { authStore } from '$lib/stores/auth';
	import Input from '$lib/components/common/Input.svelte';
	import Button from '$lib/components/common/Button.svelte';

	const dispatch = createEventDispatcher<{
		close: void;
		switchToLogin: void;
	}>();

	let lastName = '';
	let firstName = '';
	let phoneNumber = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	async function handleSubmit() {
		error = '';
		if (!lastName || !firstName || !phoneNumber || !password || !confirmPassword) {
			error = 'Бүх талбарыг бөглөнө үү'; // All fields are required
			return;
		}
		if (password !== confirmPassword) {
			error = 'Нууц үг таарахгүй байна'; // Passwords do not match
			return;
		}

		// Basic phone number validation (example)
		if (!/^\d{8}$/.test(phoneNumber)) {
			error = 'Утасны дугаар буруу байна (8 оронтой тоо)'; // Invalid phone number (8 digits)
			return;
		}

		try {
			const response = await fetch(`/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					lastName,
					firstName,
					phone: phoneNumber,
					password
				})
			});

			if (response.ok) {
				const { token } = await response.json();
				localStorage.setItem('token', token);
				const decoded: any = jwtDecode(token);
				authStore.login(decoded);
				dispatch('close');
				goto('/');
			} else {
				const { error: errorMessage } = await response.json();
				error = errorMessage;
			}
		} catch (e) {
			error = 'Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу.'; // Registration failed. Please try again.
			console.error(e);
		}
	}
</script>

<div class="relative w-full max-w-md rounded-xl bg-white">
	<h2 class="mb-4 text-center text-2xl font-bold text-gray-800">Бүртгүүлэх</h2>

	<div class="mb-6 rounded-lg border border-yellow-300 bg-yellow-100 p-3 text-sm text-yellow-800">
		<p>
			Захиалсан хоол бэлэн болсон үед танд мессежээр мэдэгдэх тул утасны дугаараа зөв оруулна уу.
		</p>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<Input type="text" placeholder="Овог" bind:value={lastName} />
		<Input type="text" placeholder="Нэр" bind:value={firstName} />
		<Input type="tel" placeholder="Утасны дугаар" bind:value={phoneNumber} />
		<Input type="password" placeholder="Нууц үг" bind:value={password} />
		<Input type="password" placeholder="Нууц дахин оруулах" bind:value={confirmPassword} />

		{#if error}
			<p class="text-center text-sm text-red-500">{error}</p>
		{/if}

		<Button
			type="submit"
			label="Бүртгүүлэх"
			className="w-full bg-red-600 text-white hover:bg-red-700"
		/>
	</form>

	<div class="mt-6 text-center">
		<span class="text-sm text-gray-600">Бүртгэлтэй юу? </span>
		<button
			on:click={() => dispatch('switchToLogin')}
			class="text-sm font-medium text-red-600 hover:underline cursor-pointer"
		>
			Нэвтрэх
		</button>
	</div>
</div>
