import { type Create } from '$lib/schema/people/interactions';
export async function queue({
	instanceId,
	personId,
	adminId,
	details,
	queue
}: {
	instanceId: number;
	personId: number;
	adminId: number;
	details: Create['details'];
	queue: App.Queue;
}): Promise<void> {
	await queue(
		'/utils/people/record_interaction',
		instanceId,
		{ person_id: personId, admin_id: adminId, details },
		adminId
	);
}
