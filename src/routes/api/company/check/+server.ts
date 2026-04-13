import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const GET: RequestHandler = async ({ url }) => {
	const regNo = url.searchParams.get('regNo');

	if (!regNo) {
		return json({ found: false, error: 'regNo is required' }, { status: 400 });
	}

	// Temporary hardcoded test data
	if (regNo === '99119911') {
		return json({
			found: true,
			tin: '37900846788',
			name: 'ТЕСТИЙН ХЭРЭГЛЭГЧ 1',
			vatPayer: true,
			cityPayer: true,
			vatpayerRegisteredDate: '2022-05-04'
		});
	}

	const posServiceUrl = publicEnv.PUBLIC_EBARIMT_SERVICE_URL || 'http://localhost:3000';
	const apiKey = env.EBARIMT_API_KEY || 'pos-service-api-key-2024';

	try {
		const res = await fetch(
			`${posServiceUrl}/api/v1/company/check?regNo=${encodeURIComponent(regNo)}`,
			{ headers: { 'x-api-key': apiKey } }
		);
		const body = await res.json();

		if (!res.ok || !body.success) {
			return json({ found: false, error: body.data?.error ?? 'Байгууллага олдсонгүй' });
		}

		return json(body.data);
	} catch (err) {
		return json({ found: false, error: 'Байгууллага шалгахад алдаа гарлаа' }, { status: 500 });
	}
};
