<script lang="ts">
	import { createQuery } from '$lib/utils/query';
	import { apiFetch } from '$lib/utils/api';
	import { env } from '$env/dynamic/public';
	import type { OrdersResponse } from '$lib/types/order';
	import OrdersHeader from '$lib/components/orders/OrdersHeader.svelte';
	import OrdersLoadingState from '$lib/components/orders/OrdersLoadingState.svelte';
	import OrdersErrorState from '$lib/components/orders/OrdersErrorState.svelte';
	import OrdersEmptyState from '$lib/components/orders/OrdersEmptyState.svelte';
	import OrdersList from '$lib/components/orders/OrdersList.svelte';

	const ordersQuery = createQuery<OrdersResponse>({
		queryKey: ['orders'],
		queryFn: () => apiFetch<OrdersResponse>(`${env.PUBLIC_BACKEND_URL}/api/order/`)
	});

	$: ({ data: ordersResponse, isLoading: loading, error, refetch } = $ordersQuery);
	$: orders = ordersResponse?.results;
</script>

<svelte:head>
	<title>Миний захиалгууд | Tomah</title>
	<meta name="description" content="Миний захиалгуудын түүх" />
</svelte:head>

<div class="container mx-auto max-w-[1200px] px-4 py-8">
	<OrdersHeader />

{#if loading}
	<OrdersLoadingState />
{:else if error}
	<OrdersErrorState {error} onRetry={() => refetch()} />
{:else if orders && orders.length === 0}
	<OrdersEmptyState />
{:else if orders}
	<OrdersList {orders} />
{/if}
</div>