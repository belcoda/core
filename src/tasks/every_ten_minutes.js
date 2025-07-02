//@ts-ignore (not in tsconfig)
const handler = async (payload, helpers) => {
	// async is optional, but best practice

	await sendEventNotifications(helpers);
	await testSendSignatureVerification(helpers);
};
export default handler;

//@ts-ignore (not in tsconfig)
async function sendEventNotifications(helpers) {
	const result = await fetch(`${process.env.GRAPHILE_WORKER_ENDPOINT}/cron/send_scheduled_emails`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.GRAPHILE_WORKER_TOKEN}`
		},
		body: JSON.stringify({})
	}).catch((e) => {
		helpers.logger.error(e);
		throw e;
	});
	if (!result.ok)
		throw new Error(`Failed to send send scheduled emails task to worker: ${result.statusText}`);
}

//@ts-ignore (not in tsconfig)
async function testSendSignatureVerification(helpers) {
	const result = await fetch(
		`${process.env.GRAPHILE_WORKER_ENDPOINT}/cron/test_send_signature_verification`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.GRAPHILE_WORKER_TOKEN}`
			},
			body: JSON.stringify({})
		}
	).catch((e) => {
		helpers.logger.error(e);
		throw e;
	});
	if (!result.ok)
		throw new Error(
			`Failed to send test send signature verification task to worker: ${result.statusText}`
		);
}
