<script lang="ts">
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth';
  import Button from '$lib/components/common/Button.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import Icon from '$lib/components/common/Icon.svelte';
  import { Search } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import logo from '$lib/assets/logo.png';

  let searchTerm = '';

  function handleSearch() {
    goto(`/?search=${searchTerm}`);
  }

  function handleLogout() {
    authStore.logout();
  }
</script>

<header class="bg-primary-dark  p-4 shadow-md">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-2xl font-bold text-accent-light flex items-center">
      <img src="{logo}" alt="Tomah Logo" class="w-24 h-10 mr-2">
    </a>

    <!-- <nav class="hidden md:flex space-x-4">
      <a href="/menu" class="hover:text-accent-light">Menu</a>
      <a href="/order" class="hover:text-accent-light">Orders</a>
    </nav> -->
    <div class="flex items-center space-x-4">
      <div class="relative flex items-center border border-gray-300 rounded-md px-3">
        <Input
          type="text"
          placeholder="Search..."
          label={undefined}
          bind:value={searchTerm}
          on:keydown={(e) => {
            const ke = e as unknown as KeyboardEvent;
            if (ke.key === 'Enter') handleSearch();
          }}
          className="border-none bg-transparent focus:ring-0 focus:outline-none  w-full"
        />
        <Icon icon={Search} size={20} color="gray" />
      </div>

      {#if $authStore.isAuthenticated}
        <span class="text-sm">Hello, {$authStore.user?.username || 'User'}</span>
        <Button label="Logout" on:click={handleLogout} variant="secondary" />
      {:else}
        <a href="/auth/login"><Button label="Login" variant="secondary" /></a>
        <a href="/auth/register"><Button label="Register" variant="primary" /></a>
      {/if}
    </div>
  </div>
</header>

<style lang="postcss">

</style>
