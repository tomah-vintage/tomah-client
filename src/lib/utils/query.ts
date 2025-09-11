import { QueryClient, QueryObserver, type QueryKey, type QueryFunction } from '@tanstack/query-core';
import { writable, type Readable } from 'svelte/store';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 1,
		},
	},
});

export interface QueryOptions<TData = unknown, TError = Error> {
	queryKey: QueryKey;
	queryFn: QueryFunction<TData>;
	enabled?: boolean;
	staleTime?: number;
	retry?: number;
}

export interface QueryResult<TData = unknown, TError = Error> {
	data: TData | undefined;
	isLoading: boolean;
	isError: boolean;
	error: TError | null;
	refetch: () => Promise<void>;
}

export function createQuery<TData = unknown, TError = Error>(
	options: QueryOptions<TData, TError>
): Readable<QueryResult<TData, TError>> {
	const { subscribe, set } = writable<QueryResult<TData, TError>>({
		data: undefined,
		isLoading: true,
		isError: false,
		error: null,
		refetch: async () => {},
	});

	const observer = new QueryObserver<TData, TError>(queryClient, {
		queryKey: options.queryKey,
		queryFn: options.queryFn,
		enabled: options.enabled ?? true,
		staleTime: options.staleTime,
		retry: options.retry,
	});

	const refetch = async () => {
		await observer.refetch();
	};

	const unsubscribe = observer.subscribe((result) => {
		set({
			data: result.data as TData | undefined,
			isLoading: result.isLoading,
			isError: result.isError,
			error: result.error as TError | null,
			refetch,
		});
	});

	return {
		subscribe: (fn) => {
			const unsubscribeStore = subscribe(fn);
			return () => {
				unsubscribeStore();
				unsubscribe();
			};
		},
	};
}