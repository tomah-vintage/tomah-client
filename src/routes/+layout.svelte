<script lang="ts">
	import '../app.css';
	import { Header, Footer } from '$lib/components/layout';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth';
	import ToastContainer from '$lib/components/common/ToastContainer.svelte';
	import SuccessModal from '$lib/components/common/SuccessModal.svelte';
	import { successModalStore } from '$lib/stores/successModal';

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

<!-- Global Success Modal -->
<SuccessModal
	showModal={$successModalStore.isOpen}
	title={$successModalStore.title}
	message={$successModalStore.message}
	buttonText={$successModalStore.buttonText}
	autoClose={$successModalStore.autoClose}
	autoCloseDelay={$successModalStore.autoCloseDelay}
	on:close={() => successModalStore.close()}
	on:confirm={() => successModalStore.close()}
/>
