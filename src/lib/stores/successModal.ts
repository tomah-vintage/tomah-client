import { writable } from 'svelte/store';

export interface SuccessModalConfig {
	title: string;
	message?: string;
	buttonText?: string;
	autoClose?: boolean;
	autoCloseDelay?: number;
}

interface SuccessModalState extends SuccessModalConfig {
	isOpen: boolean;
}

function createSuccessModalStore() {
	const { subscribe, set, update } = writable<SuccessModalState>({
		isOpen: false,
		title: '',
		message: '',
		buttonText: 'За',
		autoClose: true,
		autoCloseDelay: 3000
	});

	return {
		subscribe,
		show: (config: SuccessModalConfig) => {
			update((state) => ({
				...state,
				...config,
				isOpen: true,
				buttonText: config.buttonText || 'За',
				autoClose: config.autoClose !== undefined ? config.autoClose : true,
				autoCloseDelay: config.autoCloseDelay || 3000
			}));
		},
		close: () => {
			update((state) => ({ ...state, isOpen: false }));
		}
	};
}

export const successModalStore = createSuccessModalStore();

// Helper functions for common success messages
export const showRegistrationSuccess = () => {
	successModalStore.show({
		title: 'Ажилттай бүртгэгдлээ',
		buttonText: 'Үргэлжлүүлэх'
	});
};

export const showPasswordChangeSuccess = () => {
	successModalStore.show({
		title: 'Амжилттай нууц үг солигдлоо',
		buttonText: 'Болсон'
	});
};

export const showProfileUpdateSuccess = () => {
	successModalStore.show({
		title: 'Амжилттай шинэчиллээ',
		buttonText: 'Болсон'
	});
};

export const showFeedbackSuccess = () => {
	successModalStore.show({
		title: 'Санал амжилттай илгээгдлээ',
		message: 'Баярлалаа',
		buttonText: 'Хаах'
	});
};

export const showOrderSuccess = () => {
	successModalStore.show({
		title: 'Захиалга амжилттай үүслээ',
		message: 'Таны захиалга амжилттай баталгаажлаа',
		buttonText: 'За'
	});
};
