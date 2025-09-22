<script lang="ts">
	import { page } from '$app/stores';
	import { ErrorPage, NotFoundPage } from '$lib/components/common';

	$: status = $page.status;
	$: error = $page.error;

	function getErrorTitle(status: number): string {
		switch (status) {
			case 404:
				return 'Хуудас олдсонгүй';
			case 500:
				return 'Серверийн алдаа';
			case 403:
				return 'Хандах эрх байхгүй';
			case 401:
				return 'Нэвтрэх шаардлагатай';
			default:
				return 'Алдаа гарлаа';
		}
	}

	function getErrorMessage(status: number, error: any): string {
		switch (status) {
			case 404:
				return 'Уучлаарай, таны хайж буй хуудас олдсонгүй. Хаяг зөв эсэхийг шалгаад дахин оролдоно уу.';
			case 500:
				return 'Серверт алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу.';
			case 403:
				return 'Та энэ хуудсанд хандах эрхгүй байна.';
			case 401:
				return 'Энэ хуудсанд хандахын тулд эхлээд нэвтэрнэ үү.';
			default:
				return error?.message || 'Тодорхойгүй алдаа гарлаа. Дахин оролдоно уу.';
		}
	}
</script>

<svelte:head>
	<title>{getErrorTitle(status)} - Qpick</title>
</svelte:head>

{#if status === 404}
	<NotFoundPage 
		title={getErrorTitle(status)}
		message={getErrorMessage(status, error)}
	/>
{:else}
	<ErrorPage 
		title={getErrorTitle(status)}
		message={getErrorMessage(status, error)}
		statusCode={status}
	/>
{/if}