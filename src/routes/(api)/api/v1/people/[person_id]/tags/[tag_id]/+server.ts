import { json, error } from '$lib/server';
import * as api from '$lib/server/api/people/taggings';
import { read as readTag } from '$lib/server/api/core/tags';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';
import * as m from '$lib/paraglide/messages';
export async function POST(event) {
	try {
		const tagId = Number(event.params.tag_id);
		const personId = Number(event.params.person_id);
		const tagging = await api.create({
			instanceId: event.locals.instance.id,
			personId,
			tagId,
			t: event.locals.t
		});
		const tag = await readTag({ instanceId: event.locals.instance.id, tagId, t: event.locals.t });
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId,
			adminId: event.locals.admin.id,
			details: {
				type: 'added_tag',
				tag_id: tag.id,
				tag_name: tag.name
			},
			queue: event.locals.queue
		});
		return json(tagging, { status: 201 });
	} catch (err) {
		return error(
			500,
			'API:/api/v1/people/[person_id]/tags/[tag_id]:POST',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function DELETE(event) {
	try {
		const personId = Number(event.params.person_id);
		const tagId = Number(event.params.tag_id);
		const deleted = await api.del({
			instanceId: event.locals.instance.id,
			personId,
			tagId,
			t: event.locals.t
		});
		const tag = await readTag({ instanceId: event.locals.instance.id, tagId, t: event.locals.t });
		await queueInteraction({
			instanceId: event.locals.instance.id,
			personId,
			adminId: event.locals.admin.id,
			details: {
				type: 'removed_tag',
				tag_id: tag.id,
				tag_name: tag.name
			},
			queue: event.locals.queue
		});
		return json(deleted);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/people/[person_id]/tags/[tag_id]:DELETE',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
