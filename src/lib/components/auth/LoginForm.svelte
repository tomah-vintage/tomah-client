<script lang="ts">
	import Input from '$lib/components/common/Input.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { authStore } from '$lib/stores/auth';
	import { createEventDispatcher } from 'svelte';
	import { jwtDecode } from 'jwt-decode';

	const dispatch = createEventDispatcher();

	let email = '';
	let password = '';
	let error = '';

	async function handleSubmit() {
		error = '';
		if (!email || !password) {
			error = 'Email and password are required';
			return;
		}

		const response = await fetch(`/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (response.ok) {
			const { token } = await response.json();
			const decoded: any = jwtDecode(token);
			authStore.login(decoded);
			dispatch('close');
		} else {
			const { error: errorMessage } = await response.json();
			error = errorMessage;
		}
	}
</script>

<div class="space-y-6">
	<h2 class="text-center text-2xl font-bold">Нэвтрэх</h2>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<Input type="email" bind:value={email} placeholder="Имэйл, утасны дугаараа бичнэ үү" />
		<Input type="password" bind:value={password} placeholder="Нууц үгээ оруулна уу" />
		<div class="text-right">
			<a href="#" class="text-sm text-gray-500 hover:text-red-600">Нууц үгээ мартсан уу?</a>
		</div>
		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
		<Button type="submit" label="Үргэлжлүүлэх" variant="primary" className="w-full bg-red-600" />
	</form>
	<div class="text-center">
		<p class="text-sm text-gray-500">
			Бүртгэлтэй байгаа юу? <a
				href="#"
				on:click|preventDefault={() => dispatch('openRegister')}
				class="font-medium text-red-600 hover:underline">Яг одоо бүртгүүлэх?</a
			>
		</p>
	</div>
</div>
