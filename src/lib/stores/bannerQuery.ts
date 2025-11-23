import { createQuery } from '$lib/utils/query';
import { apiFetch } from '$lib/utils/api';
import { env } from '$env/dynamic/public';
import type { Banner, PlatformBanner } from '$lib/types/banner';

interface BannersResponse {
	results?: Banner[];
	count?: number;
	next?: string | null;
	previous?: string | null;
}

export function createMainPageBannersQuery() {
	return createQuery<BannersResponse>({
		queryKey: ['banners', 'main'],
		queryFn: async () => {
			const result = await apiFetch<BannersResponse>(`${env.PUBLIC_BACKEND_URL}/api/banner/`);
			return result;
		}
	});
}

export function createRestaurantBannersQuery(restaurantId: number) {
	return createQuery<BannersResponse>({
		queryKey: ['banners', restaurantId],
		queryFn: async () => {
			const url = `${env.PUBLIC_BACKEND_URL}/api/banner/?restaurant=${restaurantId}`;
			const result = await apiFetch<BannersResponse>(url);
			return result;
		}
	});
}

export function createPlatformBannersQuery() {
	return createQuery<PlatformBanner[]>({
		queryKey: ['platform-banners'],
		queryFn: async () => {
			const url = `${env.PUBLIC_BACKEND_URL}/api/platform-banner/`;
			const result = await apiFetch<PlatformBanner[]>(url);
			return result;
		}
	});
}
