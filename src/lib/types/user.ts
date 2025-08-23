export interface User {
	id: string;
	email: string;
	name: string;
	role: 'customer' | 'rest_admin' | 'sys_admin';
	password?: string;
}
