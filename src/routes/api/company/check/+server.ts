import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const EBARIMT_BASE = env.EBARIMT_INFO_URL ?? 'https://api.ebarimt.mn';

export const GET: RequestHandler = async ({ url }) => {
	const regNo = url.searchParams.get('regNo');

	if (!regNo) {
		return json({ found: false, error: 'regNo is required' }, { status: 400 });
	}

	try {
		// Step 1: resolve regNo → TIN
		const tinRes = await fetch(
			`${EBARIMT_BASE}/api/info/check/getTinInfo?regNo=${encodeURIComponent(regNo)}`,
			{ headers: { Accept: 'application/json' } }
		);
		const tinJson = await tinRes.json();

		if (!tinJson || tinJson.status !== 200 || !tinJson.data) {
			return json({ found: false, error: 'Байгууллага олдсонгүй' });
		}

		const tin = tinJson.data as string;

		// Step 2: fetch company info by TIN
		const infoRes = await fetch(
			`${EBARIMT_BASE}/api/info/check/getInfo?tin=${encodeURIComponent(tin)}`,
			{ headers: { Accept: 'application/json' } }
		);
		const infoJson = await infoRes.json();

		if (!infoJson || infoJson.status !== 200 || !infoJson.data?.found) {
			return json({ found: false, tin, error: 'Байгууллагын мэдээлэл олдсонгүй' });
		}

		return json({
			found: true,
			tin,
			name: infoJson.data.name ?? null,
			vatPayer: infoJson.data.vatPayer ?? false,
			cityPayer: infoJson.data.cityPayer ?? false
		});
	} catch (err) {
		return json({ found: false, error: 'Байгууллага шалгахад алдаа гарлаа' }, { status: 500 });
	}
};
