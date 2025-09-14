import type { PageLoad } from './$types';
import { restaurantActions } from '$lib/stores/restaurant';

export const load: PageLoad = async () => {
	await restaurantActions.loadRestaurants();
	return {};
};
