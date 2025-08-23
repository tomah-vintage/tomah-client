<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let name = '';
	let error = '';

	async function handleSubmit() {
		error = '';
		if (!email || !password || !confirmPassword) {
			error = 'All fields are required';
			return;
		}
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		const response = await fetch(`/api/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, name })
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
	<h2 class="text-center text-2xl font-bold">Register</h2>
	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<Input type="text" label="Name" bind:value={name} />
		<Input type="email" label="Email" bind:value={email} />
		<Input type="password" label="Password" bind:value={password} />
		<Input type="password" label="Confirm Password" bind:value={confirmPassword} />
		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
		<Button type="submit" label="Register" />
	</form>
</Card>
