export interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	role: 'customer' | 'rest_admin' | 'sys_admin';
	password?: string;
	phone?: string;
	profile_image?: string;
}
