import { writable } from 'svelte/store';

export interface LocationState {
	latitude: number | null;
	longitude: number | null;
	radius: number;
	address: string | null;
	loading: boolean;
	error: string | null;
}

const initialState: LocationState = {
	latitude: null,
	longitude: null,
	radius: 10, // Fixed 10km radius
	address: null,
	loading: false,
	error: null
};

function createLocationStore() {
	const { subscribe, set, update } = writable<LocationState>(initialState);
	let isRequestInProgress = false;

	return {
		subscribe,
		setLocation: (latitude: number, longitude: number, address?: string) => {
			update(state => ({
				...state,
				latitude,
				longitude,
				address: address || state.address,
				error: null
			}));
		},
		setRadius: (radius: number) => {
			update(state => ({ ...state, radius }));
		},
		setLoading: (loading: boolean) => {
			update(state => ({ ...state, loading }));
		},
		setError: (error: string | null) => {
			update(state => ({ ...state, error }));
		},
		clearLocation: () => {
			set(initialState);
		},
		getCurrentLocation: async (): Promise<{ latitude: number; longitude: number; address: string | null } | undefined> => {
			// Prevent multiple simultaneous requests
			if (isRequestInProgress) {
				console.log('Location request already in progress, skipping...');
				return;
			}

			isRequestInProgress = true;
			update(state => ({ ...state, loading: true, error: null }));

			// Check if geolocation is supported
			if (!navigator.geolocation) {
				const errorMessage = 'Таны хөтөч байршил тодорхойлохыг дэмжихгүй байна';
				isRequestInProgress = false;
				update(state => ({
					...state,
					loading: false,
					error: errorMessage
				}));
				throw new Error(errorMessage);
			}

			return new Promise((resolve) => {
				const handleSuccess = (position: GeolocationPosition) => {
					isRequestInProgress = false;

					const { latitude, longitude } = position.coords;
					
					// Generate simple address display from coordinates
					const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

					update(state => ({
						...state,
						latitude,
						longitude,
						address,
						loading: false,
						error: null
					}));

					resolve({ latitude, longitude, address });
				};

				navigator.geolocation.getCurrentPosition(handleSuccess);
			});
		}
	};
}

export const locationStore = createLocationStore();