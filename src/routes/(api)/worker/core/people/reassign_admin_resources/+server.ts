import { json, error, db, pool } from '$lib/server';
import { v } from '$lib/schema/valibot';
import { reassignAdminResources } from '$lib/schema/core/admin';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = v.parse(reassignAdminResources, body);

		// If no new admin is specified, use the default admin from instance settings
		const new_admin_id = parsed.new_admin_id || event.locals.instance.settings.default_admin_id;

		// Update point person in other tables
		await db
			.update(
				'people.people',
				{ point_person_id: new_admin_id },
				{ instance_id: event.locals.instance.id, point_person_id: parsed.admin_id }
			)
			.run(pool);

		await db
			.update(
				'people.groups',
				{ point_person_id: new_admin_id },
				{ instance_id: event.locals.instance.id, point_person_id: parsed.admin_id }
			)
			.run(pool);

		await db
			.update(
				'petitions.petitions',
				{ point_person_id: new_admin_id },
				{
					instance_id: event.locals.instance.id,
					point_person_id: parsed.admin_id,
					deleted_at: db.conditions.isNull
				}
			)
			.run(pool);

		await db
			.update(
				'events.events',
				{ point_person_id: new_admin_id },
				{ instance_id: event.locals.instance.id, point_person_id: parsed.admin_id }
			)
			.run(pool);

		// Update communications.email_messages
		await db
			.update(
				'communications.email_messages',
				{ point_person_id: new_admin_id },
				{ instance_id: event.locals.instance.id, point_person_id: parsed.admin_id }
			)
			.run(pool);

		// Update communications.whatsapp_threads
		await db
			.update(
				'communications.whatsapp_threads',
				{ point_person_id: new_admin_id },
				{ instance_id: event.locals.instance.id, point_person_id: parsed.admin_id }
			)
			.run(pool);

		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/core/people/reassign_admin_resources:01',
			event.locals.t.errors.generic(),
			err
		);
	}
}
