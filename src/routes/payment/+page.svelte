<script lang="ts">
	import { cart, cartTotal, clearCart } from '$lib/stores/cart';
	import { authStore } from '$lib/stores/auth';
	import { createOrder, redirectToPayment, type CreateOrderRequest } from '$lib/utils/order';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let payerType = 'company'; // "person" | "company"
	let regNumber = '';
	let isProcessingOrder = false;
	let orderError = '';
	let discount = 0;
	let packagingFee = 2000; // Fixed packaging fee

	// Calculate final amount to pay
	$: finalAmount = Math.max(0, $cartTotal - discount + packagingFee);

	onMount(() => {
		// Redirect back if cart is empty
		if ($cart.length === 0) {
			goto('/');
			return;
		}
	});

	async function handleCreateOrder() {
		// Check authentication when user tries to create order
		if (!$authStore.isAuthenticated) {
			orderError = 'Та системд нэвтэрээгүй байна. Захиалга үүсгэхийн тулд нэвтэрнэ үү.';
			return;
		}

		if ($cart.length === 0) {
			orderError = 'Сагс хоосон байна';
			return;
		}

		isProcessingOrder = true;
		orderError = '';

		try {
			// Build order data according to API format
			const items = $cart.map((item) => ({
				menu_item: item.id,
				quantity: item.quantity,
				unit_price: item.price.toString()
			}));

			const orderData: CreateOrderRequest = {
				restaurant: $cart[0].restaurant_id,
				order_type: 'TAKE_OUT', // Default to take out, could be configurable
				items
			};

			const result = await createOrder(orderData);

			if (result.success && result.order) {
				// Clear cart on successful order creation
				clearCart();

				// Redirect to payment if payment URL is provided
				if (result.order.payment?.payment_url) {
					redirectToPayment(result.order.payment.payment_url);
				} else {
					// Fallback: go to order success page
					goto(`/order/${result.order.id}`);
				}
			} else {
				orderError = result.error || 'Захиалга үүсгэхэд алдаа гарлаа';
			}
		} catch (error) {
			console.error('Order creation failed:', error);
			orderError = 'Сүлжээний алдаа гарлаа';
		} finally {
			isProcessingOrder = false;
		}
	}
</script>

<div class="container mx-auto max-w-[1200px] px-4 py-8">
	<div class="flex w-full justify-center">
		<div class="relative m-5 w-[600px] self-center rounded-2xl bg-white p-6">
			<h2 class="mb-4 text-lg font-bold">Төлбөрийн нөхцлүүд</h2>

			<!-- Order Items -->
			{#if $cart.length > 0}
				<div class="mb-4 rounded-lg border border-gray-300 p-4">
					<p class="mb-3 font-semibold">Захиалгын дэлгэрэнгүй</p>
					<div class="max-h-40 space-y-2 overflow-y-auto">
						{#each $cart as item}
							<div class="flex items-center justify-between text-sm">
								<div class="flex-1">
									<span class="font-medium">{item.name}</span>
									<span class="text-gray-500"> x{item.quantity}</span>
								</div>
								<span>{(item.price * item.quantity).toLocaleString()}₮</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Payment Summary -->
			<div class="mb-4 rounded-lg border border-gray-300 p-4">
				<p class="mb-2 font-semibold">Төлбөрийн дэлгэрэнгүй</p>
				<div class="flex justify-between text-sm">
					<span>Нийт дүн:</span>
					<span>{$cartTotal.toLocaleString()}₮</span>
				</div>
				<div class="flex justify-between text-sm">
					<span>Хямдрал:</span>
					<span>-{discount.toLocaleString()}₮</span>
				</div>
				<div class="flex justify-between text-sm">
					<span>Сав баглаа:</span>
					<span>{packagingFee.toLocaleString()}₮</span>
				</div>
				<div class="mt-2 flex justify-between text-lg font-bold">
					<span>Төлөх дүн:</span>
					<span>{finalAmount.toLocaleString()}₮</span>
				</div>
			</div>

			<!-- Payer type -->
			<div class="mb-4 rounded-lg border border-gray-300 p-4">
				<div class="flex items-center gap-6">
					<label class="flex items-center gap-2">
						<input type="radio" bind:group={payerType} value="person" />
						Хувь хүн
					</label>
					<label class="flex items-center gap-2">
						<input type="radio" bind:group={payerType} value="company" />
						Байгууллага
					</label>
				</div>
				<input
					type="text"
					placeholder="Регистрийн дугаар"
					bind:value={regNumber}
					class="mt-3 w-full rounded border border-gray-300 px-3 py-2 text-sm"
					disabled={payerType !== 'company'}
				/>
			</div>

			<!-- Payment Methods -->
			<div class="mb-4">
				<p class="mb-2 font-semibold">Төлбөрийн хэрэгслүүд</p>
				<div class="flex flex-wrap gap-2">
					<img src="/src/lib/assets/pay/qpay.png" class="h-10" alt="QPay" />
					<img src="/src/lib/assets/pay/applepay.png" class="h-10" alt="Apple Pay" />
					<img src="/src/lib/assets/pay/monpay.png" class="h-10" alt="MonPay" />
					<img src="/src/lib/assets/pay/social.png" class="h-10" alt="SocialPay" />
					<img src="/src/lib/assets/pay/golomt.png" class="h-10" alt="SocialPay" />
					<img src="/src/lib/assets/pay/khanbank.png" class="h-10" alt="SocialPay" />
					<img src="/src/lib/assets/pay/khas.png" class="h-10" alt="SocialPay" />
					<img src="/src/lib/assets/pay/tdb.png" class="h-10" alt="SocialPay" />
					<img src="/src/lib/assets/pay/turiin.png" class="h-10" alt="SocialPay" />
				</div>
			</div>

			<!-- Error message -->
			{#if orderError}
				<div class="mb-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					<p class="text-sm">{orderError}</p>
				</div>
			{/if}

			<!-- Create Order and Payment Button -->
			<button
				on:click={handleCreateOrder}
				disabled={isProcessingOrder || $cart.length === 0}
				class="flex w-full items-center justify-center rounded-lg bg-red-500 py-3 text-white hover:bg-red-600 disabled:bg-red-400"
			>
				{#if isProcessingOrder}
					<div
						class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					Захиалга үүсгэж байна...
				{:else}
					Захиалга үүсгэж төлбөр төлөх
				{/if}
			</button>

			<div class="mt-4 text-center">
				<button
					on:click={() => goto('/')}
					class="text-sm text-gray-600 underline hover:text-gray-800"
				>
					Буцах
				</button>
			</div>
		</div>
	</div>
</div>
