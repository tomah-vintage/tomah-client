<script lang="ts">
	// OTP Login component - phone-only authentication
	import Button from '$lib/components/common/Button.svelte';
	import { authStore } from '$lib/stores/auth';
	import { onDestroy, createEventDispatcher } from 'svelte';
	import { jwtDecode } from 'jwt-decode';
	import { sendOTP, loginWithOTP, ERROR_MESSAGES } from '$lib/utils/otp';

	const dispatch = createEventDispatcher<{
		openRegister: void;
		close: void;
	}>();

	let step = 1; // 1: Phone, 2: OTP
	let phoneNumber = '';
	let otpCode = '';
	let loading = false;
	let error = '';
	let countdown = 0;

	let countdownTimer: NodeJS.Timeout | null = null;

	// Countdown timer for OTP resend
	$: if (countdown > 0) {
		countdownTimer = setTimeout(() => {
			countdown = countdown - 1;
		}, 1000);
	} else if (countdownTimer) {
		clearTimeout(countdownTimer);
		countdownTimer = null;
	}

	onDestroy(() => {
		if (countdownTimer) {
			clearTimeout(countdownTimer);
		}
	});

	function validatePhoneNumber(phone: string): string | null {
		if (!phone) {
			return ERROR_MESSAGES['Phone number is required'];
		}
		
		if (phone.length !== 8) {
			return 'Утасны дугаар 8 орон байх ёстой';
		}
		
		if (!/^\d{8}$/.test(phone)) {
			return 'Утасны дугаар зөвхөн тоо агуулах ёстой';
		}
		
		return null;
	}

	async function handleSendOTP(event: Event) {
		event.preventDefault();
		loading = true;
		error = '';

		const phoneValidationError = validatePhoneNumber(phoneNumber);
		if (phoneValidationError) {
			error = phoneValidationError;
			loading = false;
			return;
		}

		const result = await sendOTP(phoneNumber);

		if (result.success) {
			step = 2;
			countdown = 300; // 5 minutes countdown
		} else {
			error = ERROR_MESSAGES[result.error || ''] || result.error || ERROR_MESSAGES['Failed to send OTP'];
		}

		loading = false;
	}

	async function handleLogin(event: Event) {
		event.preventDefault();
		loading = true;
		error = '';

		if (otpCode.length !== 4) {
			error = ERROR_MESSAGES['Please enter a 4-digit OTP code'];
			loading = false;
			return;
		}

		// For phone-only OTP, we'll pass an empty password or handle it in the backend
		const result = await loginWithOTP(phoneNumber, '', otpCode);

		if (result.success && result.access) {
			// Set cookies like the original login
			const tokenExpiry = new Date();
			tokenExpiry.setDate(tokenExpiry.getDate() + 7); // 1 week
			
			document.cookie = `token=${result.access}; path=/; expires=${tokenExpiry.toUTCString()}; ${
				window.location.protocol === 'https:' ? 'secure;' : ''
			}`;

			if (result.refresh) {
				const refreshExpiry = new Date();
				refreshExpiry.setDate(refreshExpiry.getDate() + 30); // 30 days
				
				document.cookie = `refresh_token=${result.refresh}; path=/; expires=${refreshExpiry.toUTCString()}; ${
					window.location.protocol === 'https:' ? 'secure;' : ''
				}`;
			}

			const decoded: any = jwtDecode(result.access);
			authStore.login(decoded);
			dispatch('close');
		} else {
			error = ERROR_MESSAGES[result.error || ''] || result.error || ERROR_MESSAGES['Login failed'];
		}

		loading = false;
	}

	async function handleResendOTP() {
		if (countdown > 0) return;

		const result = await sendOTP(phoneNumber);
		if (result.success) {
			countdown = 300;
			error = '';
		} else {
			error = ERROR_MESSAGES[result.error || ''] || result.error || ERROR_MESSAGES['Failed to resend OTP'];
		}
	}

	function handleBack() {
		step = 1;
		otpCode = '';
		error = '';
		countdown = 0;
		if (countdownTimer) {
			clearTimeout(countdownTimer);
			countdownTimer = null;
		}
	}

	function formatCountdown(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="space-y-6">
	{#if step === 1}
		<h2 class="text-center text-2xl font-bold">Нэвтрэх</h2>
		<form on:submit={handleSendOTP} class="space-y-4">
			<input
				type="tel"
				inputmode="numeric"
				bind:value={phoneNumber}
				placeholder="Утасны дугаар (8 орон)"
				maxlength="8"
				class="w-full rounded-lg border-2 border-transparent bg-neutral-100 py-3 px-4 transition-all duration-200 
				focus:border-primary focus:ring-2 focus:ring-primary-200 focus:bg-white focus:shadow-md
				hover:bg-neutral-50"
				on:input={(e) => {
					const target = e.target as HTMLInputElement;
					// Only allow digits and limit to 8 characters
					target.value = target.value.replace(/\D/g, '').slice(0, 8);
					phoneNumber = target.value;
				}}
			/>
			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}
			<Button 
				type="submit" 
				label={loading ? 'Илгээж байна...' : 'OTP код илгээх'} 
				variant="primary" 
				className="w-full bg-red-600"
				disabled={loading}
			/>
		</form>
	{:else}
		<h2 class="text-center text-2xl font-bold">OTP код оруулах</h2>
		<p class="text-center text-gray-600">
			Бид таны {phoneNumber} дугаарт 4 оронтой код илгээсэн
		</p>
		<form on:submit={handleLogin} class="space-y-4">
			<input
				type="text" 
				bind:value={otpCode} 
				placeholder="9999" 
				maxlength="4"
				class="w-full rounded-lg border-2 border-transparent bg-neutral-100 py-3 px-4 transition-all duration-200 
				focus:border-primary focus:ring-2 focus:ring-primary-200 focus:bg-white focus:shadow-md
				text-center text-2xl tracking-widest"
				on:input={(e) => {
					const target = e.target as HTMLInputElement;
					// Only allow digits and limit to 4 characters
					target.value = target.value.replace(/\D/g, '').slice(0, 4);
					otpCode = target.value;
				}}
			/>
			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}
			<Button 
				type="submit" 
				label={loading ? 'Шалгаж байна...' : 'Нэвтрэх'} 
				variant="primary" 
				className="w-full bg-red-600"
				disabled={loading || otpCode.length !== 4}
			/>
			
			<div class="text-center space-y-2">
				{#if countdown > 0}
					<p class="text-sm text-gray-500">
						Дахин код илгээх: {formatCountdown(countdown)}
					</p>
				{:else}
					<button 
						type="button" 
						on:click={handleResendOTP}
						class="text-sm text-red-600 hover:underline"
					>
						Дахин код илгээх
					</button>
				{/if}
			</div>

			<button 
				type="button" 
				on:click={handleBack}
				class="w-full text-center text-gray-500 hover:text-gray-700 mt-4"
			>
				← Буцах
			</button>
		</form>
	{/if}
	
	{#if step === 1}
		<div class="text-center">
			<p class="text-sm text-gray-500">
				Бүртгэлтэй байгаа юу? 
				<button
					type="button"
					on:click={() => dispatch('openRegister')}
					class="font-medium text-red-600 hover:underline"
				>
					Яг одоо бүртгүүлэх?
				</button>
			</p>
		</div>
	{/if}
</div>