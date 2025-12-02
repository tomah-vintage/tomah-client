<script lang="ts">
	import type { CartItem } from '$lib/types/cart';
	import { Package } from 'lucide-svelte';

	export let items: CartItem[];
</script>

{#if items.length > 0}
	<div class="mb-3 rounded-lg border border-gray-200 p-3 lg:mb-4 lg:p-4">
		<p class="mb-2 text-sm font-semibold lg:mb-3 lg:text-base">Захиалгын дэлгэрэнгүй</p>
		<div class="max-h-32 space-y-1.5 overflow-y-auto lg:max-h-40 lg:space-y-2">
			{#each items as item}
				<div class="flex items-center justify-between text-sm">
					<div class="flex flex-1 items-center gap-2">
						<span class="font-medium">{item.name}</span>
						<span class="text-gray-500"> x{item.quantity}</span>
						{#if item.is_takeout}
							<span
								class="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700"
								title="Авч явах"
							>
								<Package class="h-3 w-3" />
								Савтай
							</span>
						{/if}
					</div>
					<span>{(item.price * item.quantity).toLocaleString()}₮</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
