<script lang="ts">
	import '../app.css';
	import { Header, Footer } from '$lib/components/layout';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import ToastContainer from '$lib/components/common/ToastContainer.svelte';

	onMount(() => {
		// Auth store will handle initialization from cookies
		authStore.revalidate();
	});
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="container mx-auto flex-grow px-4 sm:px-6 lg:px-8">
		<slot />
	</main>
	<Footer />
</div>

<!-- Toast notifications -->
<ToastContainer />
