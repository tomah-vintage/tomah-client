<script lang="ts">
	import { cart, clearCart } from '$lib/stores/cart';
	import { authStore } from '$lib/stores/auth';
	import {
		createOrder,
		redirectToPayment,
		pollOrderPaymentStatus,
		verifyPayment,
		type CreateOrderRequest,
		type Order
	} from '$lib/utils/order';
	import { currentTable } from '$lib/stores/table';
	import { calculatePaymentTotal, shouldShowPackagingFee } from '$lib/utils/payment';
	import { createRestaurantQuery } from '$lib/stores/restaurantQuery';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { showSuccess, showError, showInfo } from '$lib/stores/toast';

	// Import components
	import OrderItems from '$lib/components/payment/OrderItems.svelte';
	import PaymentSummary from '$lib/components/payment/PaymentSummary.svelte';
	import OrderTypeSelector from '$lib/components/payment/OrderTypeSelector.svelte';
	import PayerTypeSelector from '$lib/components/payment/PayerTypeSelector.svelte';
	import PaymentMethods from '$lib/components/payment/PaymentMethods.svelte';
	import TimeSelectionModal from '$lib/components/order/TimeSelectionModal.svelte';
	import PaymentResultModal from '$lib/components/payment/PaymentResultModal.svelte';
	import { Clock } from 'lucide-svelte';

	// State variables
	let payerType: 'person' | 'company' = 'person';
	let regNumber = '';
	let companyTin = '';
	let isProcessingOrder = false;
	let orderError = '';
	let discount = 0;

	// Fetch restaurant data to get container price
	$: restaurantId = $cart[0]?.restaurant_id;
	$: restaurantQuery = restaurantId ? createRestaurantQuery(restaurantId) : null;
	$: restaurant = $restaurantQuery?.data;
	$: containerPrice = restaurant?.takeout_container_price || 2000;

	// Payment polling state
	let currentOrder: Order | null = null;
	let isPollingPayment = false;
	let paymentPollingError = '';
	let isVerifyingPayment = false;

	// Payment result modal state
	let showPaymentResultModal = false;
	let paymentSuccess = false;
	let paymentResultMessage = '';

	// Order type management
	$: hasTable = $currentTable !== null;
	let orderType: 'TAKE_OUT' | 'DINE_IN' = 'TAKE_OUT';

	// Time selection
	let showTimeModal = false;
	let scheduledTime: { date: string; time: string; isAsap: boolean } | null = null;
	let restaurantHours = { open: '09:00', close: '22:00' }; // Default hours, should come from restaurant data

	// Payment calculations
	$: paymentCalculation = calculatePaymentTotal($cart, orderType, discount);

	onMount(() => {
		// Redirect back if cart is empty
		if ($cart.length === 0) {
			goto('/');
			return;
		}

		// Initialize order type based on table presence
		if ($currentTable && orderType === 'TAKE_OUT') {
			orderType = 'DINE_IN';
		}

		// Plan B: when user returns to this tab (e.g. after closing Bonum window),
		// immediately verify payment directly with Bonum
		function handleWindowFocus() {
			if (currentOrder && isPollingPayment && !isVerifyingPayment) {
				triggerPlanB(currentOrder.id);
			}
		}
		window.addEventListener('focus', handleWindowFocus);
		return () => window.removeEventListener('focus', handleWindowFocus);
	});

	async function triggerPlanB(orderId: number) {
		isVerifyingPayment = true;
		try {
			const result = await verifyPayment(orderId);
			if (result.order?.order_status === 'PREPARING' || result.verified || result.already_processed) {
				goto(`/receipt/${orderId}?status=success`);
			}
		} catch {
			// Silent — polling will continue as the primary mechanism
		} finally {
			isVerifyingPayment = false;
		}
	}

	// Event handlers
	function handlePayerTypeChange(event: CustomEvent<'person' | 'company'>) {
		payerType = event.detail;
		companyTin = '';
	}

	function handleRegNumberChange(event: CustomEvent<string>) {
		regNumber = event.detail;
	}

	function handleCompanyValidated(event: CustomEvent<{ tin: string; name: string } | null>) {
		companyTin = event.detail?.tin ?? '';
	}

	function handleTimeConfirm(event: CustomEvent<{ date: string; time: string; isAsap: boolean }>) {
		scheduledTime = event.detail;
		// Force reactivity update
		scheduledTime = { ...scheduledTime };
	}

	function getTimeDisplayText(): string {
		if (!scheduledTime || scheduledTime.isAsap) {
			return 'Яаралтай (ASAP)';
		}
		const dateObj = new Date(scheduledTime.date);
		const dateStr = dateObj.toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' });
		return `${dateStr}, ${scheduledTime.time}`;
	}

	async function startPaymentPolling(orderId: number) {
		isPollingPayment = true;
		paymentPollingError = '';

		try {
			const finalOrder = await pollOrderPaymentStatus(
				orderId,
				(updatedOrder) => {
					currentOrder = updatedOrder;

					// Navigate to receipt page when PREPARING (payment confirmed)
					if (updatedOrder.order_status === 'PREPARING') {
						goto(`/receipt/${updatedOrder.id}?status=success`);
					}
				},
				3000, // Poll every 3 seconds
				60 // Max 3 minutes of polling
			);

			if (finalOrder) {
				// If order reached PREPARING status, navigation already happened
				if (finalOrder.order_status === 'PREPARING') {
					// Navigation already done in callback
					return;
				}
				// Payment completed, show success modal
				paymentSuccess = true;
				paymentResultMessage = 'Таны захиалга амжилттай баталгаажлаа';
				showPaymentResultModal = true;
			} else {
				// Plan B: polling timed out, verify directly with Bonum
				if (currentOrder) {
					const result = await verifyPayment(currentOrder.id);
					if (result.order?.order_status === 'PREPARING' || result.verified || result.already_processed) {
						goto(`/receipt/${currentOrder.id}?status=success`);
						return;
					}
				}
				paymentSuccess = false;
				paymentResultMessage = 'Төлбөрийн статус шалгах хугацаа дууссан. Захиалгын хуудаснаас шалгана уу.';
				showPaymentResultModal = true;
			}
		} catch (error) {
			paymentPollingError = 'Төлбөрийн статус шалгахад алдаа гарлаа';
			paymentSuccess = false;
			paymentResultMessage = 'Төлбөрийн статус шалгахад алдаа гарлаа';
			showPaymentResultModal = true;
		} finally {
			isPollingPayment = false;
		}
	}

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
				menu_item: parseInt(item.id),
				quantity: item.quantity,
				unit_price: item.price.toString(),
				is_takeout: item.is_takeout || false
			}));

			const orderData: CreateOrderRequest = {
				restaurant: $cart[0].restaurant_id,
				total_price: paymentCalculation.finalAmount.toFixed(2),
				order_type: orderType,
				items
			};

			// Add company TIN for B2B receipt when payer is a company
			if (payerType === 'company' && companyTin) {
				orderData.customer_tin = companyTin;
			}

			// Add table number if dine-in order and table is available (as string)
			if (orderType === 'DINE_IN' && $currentTable) {
				orderData.table = $currentTable.id;
			}

			const result = await createOrder(orderData);

			if (result.success && result.order) {
				currentOrder = result.order;

				// Show success toast
				showSuccess('Захиалга амжилттай үүсэгдлээ!', `Захиалгын дугаар: #${result.order.id}`);

				// Clear cart on successful order creation
				clearCart();

				// Redirect to payment if payment URL is provided
				if (result.order.payment?.payment_url) {
					showInfo(
						'Төлбөрийн хуудас нээгдэж байна...',
						'Төлбөр төлсний дараа автоматаар баталгаажуулагдана'
					);

					redirectToPayment(result.order.payment.payment_url);

					// Start polling for payment status
					startPaymentPolling(result.order.id);
				} else {
					// Fallback: go to receipt page
					goto(`/receipt/${result.order.id}?status=success`);
				}
			} else {
				orderError = result.error || 'Захиалга үүсгэхэд алдаа гарлаа';
				showError('Захиалга үүсгэхэд алдаа гарлаа', result.error);
			}
		} catch (error) {
			orderError = 'Сүлжээний алдаа гарлаа';
			showError('Сүлжээний алдаа', 'Захиалга үүсгэхэд алдаа гарлаа');
		} finally {
			isProcessingOrder = false;
		}
	}
</script>

<svelte:head>
	<title>Төлбөр төлөх - Tomah</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 lg:bg-white lg:py-8">
	<div class="mx-auto max-w-2xl lg:px-4">
		<div class="bg-white pt-4 lg:m-5 lg:rounded-2xl lg:p-6 lg:shadow-lg">
			<h2 class="mb-3 text-lg font-bold lg:mb-4">Төлбөрийн нөхцлүүд</h2>

			<!-- Order Items Component -->
			<OrderItems items={$cart} />

			<!-- Payment Summary Component -->
			<PaymentSummary
				cartTotal={paymentCalculation.cartTotal}
				{discount}
				packagingFee={paymentCalculation.appliedPackagingFee}
				finalAmount={paymentCalculation.finalAmount}
			/>

			<!-- Order Type Selection Component -->
			<OrderTypeSelector bind:orderType {hasTable} />

			<!-- Time Selection (only show when table is NOT available) -->
			{#if !hasTable}
				<div class="mb-4 rounded-lg border border-gray-200 bg-white p-4">
					<div class="mb-3 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<Clock class="h-5 w-5 text-gray-600" />
							<h3 class="font-semibold text-gray-900">Хүргэлтийн цаг</h3>
						</div>
						<button
							on:click={() => (showTimeModal = true)}
							class="text-sm font-medium text-red-600 hover:text-red-700"
						>
							Өөрчлөх
						</button>
					</div>
					<div class="rounded-lg bg-gray-50 p-3">
						<p class="text-sm font-medium text-gray-700">
							{getTimeDisplayText()}
						</p>
						{#if scheduledTime && !scheduledTime.isAsap}
							<p class="mt-1 text-xs text-gray-500">
								Захиалга {scheduledTime.date}
								{scheduledTime.time} цагт бэлэн болно
							</p>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Payer Type Component -->
			<PayerTypeSelector
				bind:payerType
				bind:regNumber
				on:payerTypeChange={handlePayerTypeChange}
				on:regNumberChange={handleRegNumberChange}
				on:companyValidated={handleCompanyValidated}
			/>

			<!-- Payment Methods Component -->
			<PaymentMethods />

			<!-- Error message -->
			{#if orderError}
				<div
					class="mb-3 rounded-lg border border-red-400 bg-red-100 px-3 py-2 text-red-700 lg:mb-4 lg:px-4 lg:py-3"
				>
					<p class="text-sm">{orderError}</p>
				</div>
			{/if}

			<!-- Payment polling status -->
			{#if isPollingPayment}
				<div
					class="mb-3 rounded-lg border border-blue-400 bg-blue-100 px-3 py-2 text-blue-700 lg:mb-4 lg:px-4 lg:py-3"
				>
					<div class="flex items-center gap-2">
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
						></div>
						<p class="text-sm">Төлбөрийн статус шалгаж байна...</p>
					</div>
				</div>
			{/if}

			{#if paymentPollingError}
				<div
					class="mb-3 rounded-lg border border-orange-400 bg-orange-100 px-3 py-2 text-orange-700 lg:mb-4 lg:px-4 lg:py-3"
				>
					<p class="text-sm">{paymentPollingError}</p>
				</div>
			{/if}

			<!-- Create Order and Payment Button -->
			<button
				on:click={handleCreateOrder}
				disabled={isProcessingOrder || isPollingPayment || $cart.length === 0}
				class="flex w-full items-center justify-center rounded-lg bg-red-500 py-3 text-sm font-medium text-white hover:bg-red-600 disabled:bg-red-400 lg:py-3 lg:text-base"
			>
				{#if isProcessingOrder}
					<div
						class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					Захиалга үүсгэж байна...
				{:else if isPollingPayment}
					<div
						class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					Төлбөрийн статус шалгаж байна...
				{:else}
					Захиалга үүсгэж төлбөр төлөх ({paymentCalculation.finalAmount.toLocaleString()}₮)
				{/if}
			</button>

			<div class="mt-3 text-center lg:mt-4">
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

<!-- Time Selection Modal -->
<TimeSelectionModal
	bind:showModal={showTimeModal}
	{restaurantHours}
	on:close={() => (showTimeModal = false)}
	on:confirm={handleTimeConfirm}
/>

<!-- Payment Result Modal -->
<PaymentResultModal
	bind:showModal={showPaymentResultModal}
	success={paymentSuccess}
	title={paymentSuccess ? 'Төлбөр амжилттай!' : 'Төлбөр амжилтгүй'}
	message={paymentResultMessage}
	orderId={currentOrder?.id || null}
	amount={currentOrder?.total_price ? parseFloat(currentOrder.total_price).toLocaleString() : ''}
	on:close={() => {
		showPaymentResultModal = false;
		if (paymentSuccess && currentOrder) {
			goto(`/orders`);
		}
	}}
	on:viewReceipt={(e) => {
		showPaymentResultModal = false;
		goto(`/receipt/${e.detail.orderId}`);
	}}
	on:viewOrder={(e) => {
		showPaymentResultModal = false;
		goto(`/order/${e.detail.orderId}`);
	}}
/>
