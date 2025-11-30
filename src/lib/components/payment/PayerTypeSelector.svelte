<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let payerType: 'person' | 'company';
	export let regNumber: string;

	const dispatch = createEventDispatcher<{
		payerTypeChange: 'person' | 'company';
		regNumberChange: string;
	}>();

	function handlePayerTypeChange(type: 'person' | 'company') {
		payerType = type;
		dispatch('payerTypeChange', type);
	}

	function handleRegNumberChange(event: Event) {
		const target = event.target as HTMLInputElement;
		regNumber = target.value;
		dispatch('regNumberChange', target.value);
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
		<input
			type="text"
			placeholder="Регистрийн дугаар"
			bind:value={regNumber}
			on:input={handleRegNumberChange}
			class="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
		/>
	{/if}
</div>
