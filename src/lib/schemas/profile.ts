import { z } from 'zod';

// Profile form validation schema
export const profileSchema = z.object({
	first_name: z
		.string()
		.min(1, 'Нэр заавал бөглөнө үү')
		.max(50, 'Нэр 50 тэмдэгтээс хэтрэхгүй байна'),
	last_name: z
		.string()
		.min(1, 'Овог заавал бөглөнө үү')
		.max(50, 'Овог 50 тэмдэгтээс хэтрэхгүй байна'),
	email: z
		.string()
		.min(1, 'И-мэйл заавал бөглөнө үү')
		.email('И-мэйл хаяг буруу байна'),
	phone: z
		.string()
		.optional()
		.refine(
			(phone) => !phone || /^[0-9+\-\s()]*$/.test(phone),
			'Утасны дугаар буруу форматтай байна'
		)
});

// Password change validation schema
export const passwordSchema = z
	.object({
		new_password: z
			.string()
			.min(6, 'Нууц үг дор хаяж 6 тэмдэгт байх ёстой')
			.max(100, 'Нууц үг 100 тэмдэгтээс хэтрэхгүй байна'),
		confirm_password: z.string()
	})
	.refine((data) => data.new_password === data.confirm_password, {
		message: 'Нууц үг таарахгүй байна',
		path: ['confirm_password']
	});

// Image file validation schema
export const imageFileSchema = z
	.instanceof(File)
	.refine(
		(file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
		'Зөвхөн JPG, PNG, WEBP форматын зураг боломжтой'
	)
	.refine(
		(file) => file.size <= 5 * 1024 * 1024, // 5MB
		'Зургийн хэмжээ 5MB-аас бага байх ёстой'
	);

// Types derived from schemas
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;