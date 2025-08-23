<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';

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
			localStorage.setItem('token', token);
			const decoded: any = jwtDecode(token);
			authStore.login(decoded);
			goto('/');
		} else {
			const { error: errorMessage } = await response.json();
			error = errorMessage;
		}
	}
</script>

<Card>
	<h2 class="text-center text-2xl font-bold">Login</h2>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<Input type="email" label="Email" bind:value={email} />
		<Input type="password" label="Password" bind:value={password} />
		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
		<Button type="submit" label="Login" />
	</form>
</Card>
