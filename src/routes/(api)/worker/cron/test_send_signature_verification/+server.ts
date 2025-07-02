import { json, error, pino } from '$lib/server';
const log = pino(import.meta.url);
import * as api from '$lib/server/api/communications/email/from_signatures';
export async function POST(event) {
	try {
		// we don't have any instance or admin ID here. We're flying blind...
		const arrayToVerifiy = [
			...(await api._unsafeGetAllPendingDomainVerification()),
			...(await api._unsafeGetAllPendingVerification())
		];
		log.debug({ arrayToVerifiy }, 'array to verify');
		for (let index = 0; index < arrayToVerifiy.length; index++) {
			const fromSignature = arrayToVerifiy[index];
			try {
				await api.testVerificationStatus({
					instanceId: fromSignature.instance_id,
					fromSignatureId: fromSignature.id
				});
				await sleep(1000); // Sleep for 1 second
			} catch (err) {
				log.error(err, 'Unable to verify from signature');
			}
		}
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/email/from_signatures/test_send_signature_verification:01',
			'error verifying from signature',
			err
		);
	} finally {
		return json({ success: true });
	}
}

// Simple helper function to sleep
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
