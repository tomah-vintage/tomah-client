import { browser } from '$app/environment';
import { goto } from '$app/navigation';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export const getAuthToken = (): string | null => {
	if (typeof document === 'undefined') return null;
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith('token=')) {
			return cookie.substring('token='.length, cookie.length);
		}
	}
	return null;
};

export const getRefreshToken = (): string | null => {
	if (typeof document === 'undefined') return null;
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith('refresh_token=')) {
			return cookie.substring('refresh_token='.length, cookie.length);
		}
	}
	return null;
};

async function refreshToken(): Promise<void> {
	const refreshToken = getRefreshToken();
	
	if (!refreshToken) {
		if (browser) {
			// Clear any remaining tokens and redirect to home
			document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
			document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
			await goto(`/`);
		}
		throw new Error('No refresh token available');
	}

	const response = await fetch(`/api/auth/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		// If refresh fails, clear tokens and redirect
		if (browser) {
			document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
			document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
			await goto(`/`);
		}
		
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || 'Failed to refresh token');
	}

	const data = await response.json();
	console.log('Token refreshed successfully:', data.message);
}

async function fetchWithRefresh<T>(
	url: string,
	options: RequestInit = {},
	type: 'request' | 'file' = 'request'
): Promise<T> {
	const getHeaders = (): Headers => {
		const headers = new Headers(options.headers);
		if (type === 'request') headers.set('Content-Type', 'application/json');

		const token = getAuthToken();
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	};

	const requestOptions: RequestInit = {
		...options,
		headers: getHeaders()
	};

	let response = await fetch(url, requestOptions);

	// Check for token validation errors
	const shouldRefreshToken = async (response: Response): Promise<boolean> => {
		if (response.status === 401) {
			// Try to parse response body to check for specific token errors
			try {
				const errorData = await response.clone().json();
				// Check for JWT token validation errors
				if (errorData.code === 'token_not_valid' || 
					errorData.detail?.includes('token not valid') ||
					errorData.detail?.includes('Token is invalid or expired')) {
					return true;
				}
			} catch (e) {
				// If we can't parse the response, treat any 401 as a token issue
				return true;
			}
			return true;
		}
		return false;
	};

	if (await shouldRefreshToken(response)) {
		if (!isRefreshing) {
			isRefreshing = true;
			try {
				refreshPromise = refreshToken();
				await refreshPromise;
				// Retry the original request with the new token
				response = await fetch(url, { ...requestOptions, headers: getHeaders() });
			} catch (refreshError) {
				// If refresh fails, don't retry - let the error bubble up
				console.error('Token refresh failed:', refreshError);
			} finally {
				isRefreshing = false;
				refreshPromise = null;
			}
		} else if (refreshPromise) {
			// Wait for the ongoing refresh to complete
			try {
				await refreshPromise;
				// Retry the original request with the new token
				requestOptions.headers = getHeaders();
				response = await fetch(url, requestOptions);
			} catch (e) {
				// If waiting for refresh fails, continue with original response
				console.error('Error waiting for token refresh:', e);
			}
		}
	}

	if (!response.ok) {
		// Handle other errors
		try {
			const error = await response.json();
			// Provide more detailed error information
			const errorMessage = error.detail || error.message || error.error || 'An error occurred';
			const apiError = new Error(errorMessage);
			// Attach additional error details if available
			(apiError as any).status = response.status;
			(apiError as any).code = error.code;
			(apiError as any).messages = error.messages;
			throw apiError;
		} catch (parseError) {
			// If we can't parse the error response, create a generic error
			const genericError = new Error(`HTTP ${response.status}: ${response.statusText}`);
			(genericError as any).status = response.status;
			throw genericError;
		}
	}

	// Handle responses with no content
	const contentType = response.headers.get('content-type');
	if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
		return Promise.resolve() as Promise<T>;
	}

	return response.json() as Promise<T>;
}

export const apiFetch = fetchWithRefresh;
