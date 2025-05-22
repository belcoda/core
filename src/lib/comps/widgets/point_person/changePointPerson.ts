export type ChangePointPersonType =
	| 'event'
	| 'email_message'
	| 'whatsapp_thread'
	| 'person'
	| 'petition'
	| 'task';
import { type List, list, type Read, read } from '$lib/schema/core/admin';
import { parse } from '$lib/schema/valibot';
export async function loadAdmins(): Promise<List['items']> {
	const response = await fetch('/api/v1/admins');
	if (!response.ok) {
		throw new Error(`Failed to load admins: ${response.statusText}`);
	}
	const body = await response.json();
	const parsed = parse(list, body);
	return parsed.items;
}

export async function changePointPerson(
	type: ChangePointPersonType,
	pointPersonId: number,
	objectId: number
): Promise<Read> {
	const updateUrlMap: { [key in ChangePointPersonType]: string } = {
		event: `/api/v1/events/${objectId}`,
		email_message: `/api/v1/communications/email/messages/${objectId}`,
		whatsapp_thread: `/api/v1/communications/whatsapp/threads/${objectId}`,
		person: `/api/v1/people/people/${objectId}`,
		task: `/api/v1/tasks/${objectId}`,
		petition: `/api/v1/petitions/${objectId}`
	};
	const response = await fetch(updateUrlMap[type], {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(
			type !== 'task' ? { point_person_id: pointPersonId } : { assigned_to: pointPersonId }
		) //tasks have a different field name for point person (assigned_to) than other objects (point_person_id)
	});
	if (!response.ok) {
		throw new Error(`Failed to change point person to ${pointPersonId}: ${response.statusText}`);
	}

	const adminResponse = await fetch(`/api/v1/admins/${pointPersonId}`);
	if (!adminResponse.ok) {
		throw new Error(`Failed to load admin: ${adminResponse.statusText}`);
	}
	const adminBody = await adminResponse.json();
	const adminParsed = parse(read, adminBody);
	return adminParsed;
}
