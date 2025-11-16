<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { Camera, X, AlertCircle } from 'lucide-svelte';
	import Modal from '$lib/components/common/Modal.svelte';

	export let showModal = false;

	const dispatch = createEventDispatcher<{
		close: void;
		scanned: { url: string; restaurantId?: string; tableId?: string };
	}>();

	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;
	let stream: MediaStream | null = null;
	let scanning = false;
	let error = '';
	let manualInput = '';
	let showManualInput = false;

	onMount(() => {
		if (showModal) {
			startCamera();
		}
	});

	onDestroy(() => {
		stopCamera();
	});

	async function startCamera() {
		try {
			error = '';
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' }
			});

			if (videoElement) {
				videoElement.srcObject = stream;
				await videoElement.play();
				scanning = true;
				scanQRCode();
			}
		} catch (err) {
			console.error('Camera access error:', err);
			error = 'Камер ашиглах эрх олгоно уу';
			showManualInput = true;
		}
	}

	function stopCamera() {
		scanning = false;
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	async function scanQRCode() {
		if (!scanning || !videoElement || !canvasElement) return;

		const canvas = canvasElement;
		const video = videoElement;
		const context = canvas.getContext('2d');

		if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
			requestAnimationFrame(scanQRCode);
			return;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		try {
			// Use jsQR or similar library if needed
			// For now, we'll rely on manual input
			requestAnimationFrame(scanQRCode);
		} catch (err) {
			requestAnimationFrame(scanQRCode);
		}
	}

	function handleManualSubmit() {
		if (!manualInput.trim()) {
			error = 'QR код эсвэл URL оруулна уу';
			return;
		}

		processQRData(manualInput);
	}

	function processQRData(data: string) {
		try {
			// Parse URL format: /restaurant/{id}?table={tableId}
			const url = new URL(data, window.location.origin);
			const pathParts = url.pathname.split('/');
			const restaurantId = pathParts[pathParts.indexOf('restaurant') + 1];
			const tableId = url.searchParams.get('table');

			if (restaurantId) {
				dispatch('scanned', {
					url: data,
					restaurantId,
					tableId: tableId || undefined
				});
				closeModal();
			} else {
				error = 'QR код буруу байна';
			}
		} catch (err) {
			error = 'QR код буруу байна';
		}
	}

	function closeModal() {
		stopCamera();
		// Reset state
		showManualInput = false;
		manualInput = '';
		error = '';
		dispatch('close');
	}

	// Watch for modal close to stop camera
	$: if (!showModal && stream) {
		stopCamera();
	}

	// Watch for modal open to start camera
	$: if (showModal && !stream && !showManualInput) {
		setTimeout(() => startCamera(), 100);
	}
</script>

<Modal {showModal} on:close={closeModal}>
	<div class="flex flex-col items-center">
		<h2 class="mb-4 text-xl font-bold text-gray-900">QR код уншуулах</h2>

		{#if error}
			<div class="mb-4 flex w-full items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
				<AlertCircle class="h-5 w-5 flex-shrink-0" />
				<p class="text-sm">{error}</p>
			</div>
		{/if}

		{#if !showManualInput && !error}
			<div class="relative mb-4 w-full overflow-hidden rounded-lg bg-black">
				<video bind:this={videoElement} class="h-64 w-full object-cover" playsinline autoplay muted
				></video>
				<canvas bind:this={canvasElement} class="hidden"></canvas>

				<!-- Scanning overlay -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="h-48 w-48 border-4 border-white opacity-50"></div>
				</div>

				<div class="absolute right-0 bottom-4 left-0 text-center text-sm text-white">
					QR кодыг дэлгэцийн төв рүү чиглүүлнэ үү
				</div>
			</div>
		{/if}

		<!-- Manual Input -->
		<div class="w-full">
			{#if !showManualInput}
				<button
					on:click={() => (showManualInput = true)}
					class="w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-700 hover:bg-gray-50"
				>
					Гараар оруулах
				</button>
			{:else}
				<div class="space-y-3">
					<div>
						<label for="manual-qr" class="mb-2 block text-sm font-medium text-gray-700">
							QR код эсвэл URL
						</label>
						<input
							id="manual-qr"
							type="text"
							bind:value={manualInput}
							placeholder="https://tomah.mn/restaurant/123?table=5"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
							on:keydown={(e) => {
								if (e.key === 'Enter') handleManualSubmit();
							}}
						/>
					</div>

					<div class="flex gap-2">
						<button
							on:click={handleManualSubmit}
							class="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
						>
							Үргэлжлүүлэх
						</button>
						{#if !error}
							<button
								on:click={() => {
									showManualInput = false;
									startCamera();
								}}
								class="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
							>
								<Camera class="h-4 w-4" />
								Камер
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</Modal>
