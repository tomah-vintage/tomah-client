<script lang="ts">
	import { onMount } from 'svelte';
	let code: string[] = ['', '', '', ''];
	let timer = 20;
	let intervalTime: number = 20000;
	let interval: NodeJS.Timer;

	// Countdown timer
	onMount(() => {
		startTimer();
	});

	function startTimer() {
		clearInterval(intervalTime);
		timer = 20;
		interval = setInterval(() => {
			if (timer > 0) {
				timer--;
			} else {
				clearInterval(intervalTime);
			}
		}, 1000);
	}

	function resendCode() {
		startTimer();
		// call backend API to resend OTP
	}

	function submitCode() {
		const otp = code.join('');
		// send OTP to backend
	}

	function handleInput(e: Event, index: number) {
		const input = e.target as HTMLInputElement;
		code[index] = input.value.slice(-1); // only last digit
		if (input.value && index < code.length - 1) {
			(document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
		}
	}
</script>

<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
	<div class="w-80 rounded-lg bg-white p-6 text-center shadow-lg">
		<button class="absolute top-4 left-4">←</button>
		<h2 class="mb-2 text-lg font-bold">Бүртгүүлэх</h2>
		<p class="mb-4 text-gray-600">
			Бид таны утас руу идэвхжүүлэх код бүхий SMS илгээсэн <br />
			<span class="font-semibold">99308877</span>
		</p>

		<!-- OTP inputs -->
		<div class="mb-4 flex justify-center space-x-2">
			{#each code as c, i}
				<input
					id={'otp-' + i}
					type="text"
					bind:value={code[i]}
					maxlength="1"
					class="h-12 w-12 rounded-lg border-2 text-center text-xl"
					on:input={(e) => handleInput(e, i)}
				/>
			{/each}
		</div>

		<!-- Resend and timer -->
		<div class="mb-4 flex items-center justify-center space-x-2 text-gray-600">
			<button
				on:click={resendCode}
				class="text-blue-500 disabled:text-gray-400"
				disabled={timer > 0}
			>
				Код дахин илгээх үү
			</button>
			<span>{timer > 0 ? `00:${String(timer).padStart(2, '0')}` : ''}</span>
		</div>

		<!-- Continue button -->
		<button
			on:click={submitCode}
			class="w-full rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
		>
			Үргэлжлүүлэх
		</button>
	</div>
</div>

<style>
	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
