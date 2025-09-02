<script lang="ts">
	import '../app.css';
	import { Header, Footer } from '$lib/components/layout';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import { jwtDecode } from 'jwt-decode';

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const decoded: any = jwtDecode(token);
			authStore.login(decoded);
		}
	});
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="container mx-auto flex-grow">
		<slot />
	</main>
	<Footer />
</div>
