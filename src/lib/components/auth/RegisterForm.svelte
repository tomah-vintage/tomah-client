<script lang="ts">
  import Card from '$lib/components/common/Card.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { PUBLIC_BACKEND_URL } from '$env/static/public';

  let email = '';
  let password = '';
  let confirmPassword = '';
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

    const response = await fetch(`${PUBLIC_BACKEND_URL}/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, role: 3 })
    });

    if (response.ok) {
      const { user } = await response.json();
      authStore.login(user);
      goto('/');
    } else {
      const { detail: errorMessage } = await response.json();
      error = errorMessage;
    }
  }
</script>

<Card>
  <h2 class="text-2xl font-bold text-center">Register</h2>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <Input type="email" label="Email" bind:value={email} />
    <Input type="password" label="Password" bind:value={password} />
    <Input type="password" label="Confirm Password" bind:value={confirmPassword} />
    {#if error}
      <p class="text-red-500">{error}</p>
    {/if}
    <Button type="submit" label="Register" />
  </form>
</Card>
