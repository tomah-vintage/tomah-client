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
			console.log('Fetching main page banners from:', `${env.PUBLIC_BACKEND_URL}/api/banner/`);
			const result = await apiFetch<BannersResponse>(`${env.PUBLIC_BACKEND_URL}/api/banner/`);
			console.log('Banner API response:', result);
			return result;
		}
	});
}

export function createRestaurantBannersQuery(restaurantId: number) {
	return createQuery<BannersResponse>({
		queryKey: ['banners', restaurantId],
		queryFn: async () => {
			const url = `${env.PUBLIC_BACKEND_URL}/api/banner/?restaurant=${restaurantId}`;
			console.log('Fetching restaurant banners from:', url);
			const result = await apiFetch<BannersResponse>(url);
			console.log('Restaurant Banner API response:', result);
			return result;
		}
	});
}

export function createPlatformBannersQuery() {
	return createQuery<PlatformBanner[]>({
		queryKey: ['platform-banners'],
		queryFn: async () => {
			const url = `${env.PUBLIC_BACKEND_URL}/api/platform-banner/`;
			console.log('Fetching platform banners from:', url);
			const result = await apiFetch<PlatformBanner[]>(url);
			console.log('Platform Banner API response:', result);
			return result;
		}
	});
}
