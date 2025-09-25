// OTP utility functions for frontend API calls

export interface OTPResponse {
	success: boolean;
	message?: string;
	error?: string;
}

export interface LoginOTPResponse extends OTPResponse {
	access?: string;
	refresh?: string;
	user_id?: string;
}

export interface RegisterOTPResponse extends OTPResponse {
	access?: string;
	refresh?: string;
	user_id?: string;
}

export const sendOTP = async (phoneNumber: string, purpose = 'login'): Promise<OTPResponse> => {
	try {
		const response = await fetch(`/api/otp/send/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone: phoneNumber,
				purpose
			})
		});

		const data = await response.json();

		if (response.ok) {
			return { success: true, message: data.message };
		} else {
			return { success: false, error: data.error || 'Failed to send OTP' };
		}
	} catch (error) {
		console.error('Network error sending OTP:', error);
		return { success: false, error: 'Network error occurred' };
	}
};

export const loginWithOTP = async (
	phoneNumber: string,
	password: string,
	otpCode: string
): Promise<LoginOTPResponse> => {
	try {
		const requestBody: any = {
			phone: phoneNumber,
			otp_code: otpCode
		};

		// Only include password if it's provided (for backward compatibility)
		if (password && password.trim() !== '') {
			requestBody.password = password;
		}

		const response = await fetch(`/api/otp/login/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		const data = await response.json();

		if (response.ok) {
			return {
				success: true,
				access: data.access,
				refresh: data.refresh,
				user_id: data.user_id,
				message: data.message
			};
		} else {
			return { success: false, error: data.error || 'Login failed' };
		}
	} catch (error) {
		console.error('Network error during OTP login:', error);
		return { success: false, error: 'Network error occurred' };
	}
};

export const registerWithOTP = async (
	phoneNumber: string,
	otpCode: string,
	email: string,
	firstName: string,
	lastName: string,
	password: string
): Promise<RegisterOTPResponse> => {
	try {
		const response = await fetch(`/api/otp/register/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				phone: phoneNumber,
				otp_code: otpCode,
				email,
				first_name: firstName,
				last_name: lastName,
				password
			})
		});

		const data = await response.json();

		if (response.ok) {
			return {
				success: true,
				access: data.access,
				refresh: data.refresh,
				user_id: data.user_id,
				message: data.message
			};
		} else {
			return { success: false, error: data.error || 'Registration failed' };
		}
	} catch (error) {
		console.error('Network error during OTP registration:', error);
		return { success: false, error: 'Network error occurred' };
	}
};

export const ERROR_MESSAGES: Record<string, string> = {
	'User not found': 'Утасны дугаар бүртгэлгүй байна',
	'Invalid phone number or password': 'Утасны дугаар эсвэл нууц үг буруу байна',
	'Invalid OTP': 'OTP код буруу байна',
	'OTP has expired': 'OTP кодын хугацаа дууссан, шинээр авна уу',
	'Failed to send OTP. Please try again.': 'OTP код илгээж чадсангүй, дахин оролдоно уу',
	'User already exists': 'И-мэйл эсвэл утасны дугаар аль хэдийн бүртгэгдсэн байна',
	'Phone number already exists': 'Утасны дугаар аль хэдийн бүртгэгдсэн байна',
	'Email already exists': 'И-мэйл хаяг аль хэдийн бүртгэгдсэн байна',
	'Phone number is required': 'Утасны дугаар шаардлагатай',
	'Please enter a 4-digit OTP code': 'OTP 4 оронтой код оруулна уу',
	'Network error occurred': 'Сүлжээний алдаа гарлаа',
	'Failed to send OTP': 'OTP код илгээж чадсангүй',
	'Login failed': 'Нэвтрэх амжилтгүй боллоо',
	'Registration failed': 'Бүртгэл амжилтгүй боллоо',
	'Failed to resend OTP': 'OTP код дахин илгээж чадсангүй'
};