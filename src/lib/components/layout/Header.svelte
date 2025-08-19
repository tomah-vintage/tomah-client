<script lang="ts">
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';

  let searchTerm = '';

  function handleSearch() {
    console.log('Searching for:', searchTerm);
    // Implement actual search logic here
  }

  function handleLogout() {
    authStore.logout();
  }
</script>

<header class="bg-primary-dark text-white p-4 shadow-md">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-2xl font-bold text-accent-light">Tomah</a>

    <nav class="hidden md:flex space-x-4">
      <a href="/menu" class="hover:text-accent-light">Menu</a>
      <a href="/order" class="hover:text-accent-light">Orders</a>
      <!-- Add more navigation links as needed -->
    </nav>

    <div class="flex items-center space-x-4">
      <div class="relative">
        <!-- <Input
          type="text"
          placeholder="Search..."
          bind:value={searchTerm}
          on:keydown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        /> -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {#if $authStore.isAuthenticated}
        <span class="text-sm">Hello, {$authStore.user?.username || 'User'}</span>
        <Button label="Logout" onClick={handleLogout} variant="secondary" />
      {:else}
        <Button label="Login" href="/auth/login" variant="secondary" />
        <Button label="Register" href="/auth/register" variant="primary" />
      {/if}
    </div>
  </div>
</header>

<style lang="postcss">

</style>
