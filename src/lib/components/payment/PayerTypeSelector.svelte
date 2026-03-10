<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { PUBLIC_EBARIMT_SERVICE_URL } from '$env/static/public';

	export let payerType: 'person' | 'company';
	export let regNumber: string;

	const dispatch = createEventDispatcher<{
		payerTypeChange: 'person' | 'company';
		regNumberChange: string;
		companyValidated: { tin: string; name: string } | null;
	}>();

	let isCheckingCompany = false;
	let companyName: string | null = null;
	let companyError: string | null = null;
	let checkTimeout: ReturnType<typeof setTimeout> | null = null;

	function handlePayerTypeChange(type: 'person' | 'company') {
		payerType = type;
		// Reset company state when switching type
		companyName = null;
		companyError = null;
		regNumber = '';
		dispatch('payerTypeChange', type);
		dispatch('companyValidated', null);
	}

	function handleRegNumberInput(event: Event) {
		const target = event.target as HTMLInputElement;
		regNumber = target.value;
		dispatch('regNumberChange', regNumber);

		// Reset state
		companyName = null;
		companyError = null;
		dispatch('companyValidated', null);

		if (checkTimeout) clearTimeout(checkTimeout);

		const trimmed = regNumber.trim();
		if (trimmed.length < 7) return;

		checkTimeout = setTimeout(() => checkCompany(trimmed), 600);
	}

	async function checkCompany(regNo: string) {
		isCheckingCompany = true;
		companyName = null;
		companyError = null;

		try {
			const res = await fetch(
				`${PUBLIC_EBARIMT_SERVICE_URL}/api/v1/company/check?regNo=${encodeURIComponent(regNo)}`
			);
			const json = await res.json();

			if (json.success && json.data?.found) {
				companyName = json.data.name ?? 'Байгууллага олдлоо';
				dispatch('companyValidated', { tin: json.data.tin, name: companyName });
			} else {
				companyError = json.data?.error ?? 'Байгууллага олдсонгүй';
				dispatch('companyValidated', null);
			}
		} catch {
			companyError = 'Байгууллага шалгахад алдаа гарлаа';
			dispatch('companyValidated', null);
		} finally {
			isCheckingCompany = false;
		}
	}
</script>

<div class="mb-3 rounded-lg border border-gray-200 p-3 lg:mb-4 lg:p-4">
	<div class="flex items-center gap-4 lg:gap-6">
		<label class="flex items-center gap-2 text-sm lg:text-base">
			<input
				type="radio"
				bind:group={payerType}
				value="person"
				on:change={() => handlePayerTypeChange('person')}
			/>
			Хувь хүн
		</label>
		<label class="flex items-center gap-2 text-sm lg:text-base">
			<input
				type="radio"
				bind:group={payerType}
				value="company"
				on:change={() => handlePayerTypeChange('company')}
			/>
			Байгууллага
		</label>
	</div>

	{#if payerType === 'company'}
		<div class="mt-2">
			<div class="relative">
				<input
					type="text"
					placeholder="Регистрийн дугаар"
					bind:value={regNumber}
					on:input={handleRegNumberInput}
					class="w-full rounded border px-3 py-2 text-sm pr-8
						{companyName
							? 'border-green-400 bg-green-50'
							: companyError
								? 'border-red-400 bg-red-50'
								: 'border-gray-300'}"
				/>
				{#if isCheckingCompany}
					<div
						class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"
					></div>
				{:else if companyName}
					<svg
						class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				{:else if companyError}
					<svg
						class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{/if}
			</div>

			{#if companyName}
				<p class="mt-1 text-xs font-medium text-green-600">{companyName}</p>
			{:else if companyError}
				<p class="mt-1 text-xs text-red-500">{companyError}</p>
			{/if}
		</div>
	{/if}
</div>
