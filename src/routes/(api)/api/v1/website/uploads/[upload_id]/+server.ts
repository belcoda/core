import { json, error } from '$lib/server';
import * as api from '$lib/server/api/website/uploads';
import * as m from '$lib/paraglide/messages';
export async function GET(event) {
	try {
		const uploadId = Number(event.params.upload_id);
		const upload = await api.read({
			instanceId: event.locals.instance.id,
			uploadId
		});
		return json(upload);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/website/uploads/[upload_id]/:GET:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}

export async function DELETE(event) {
	try {
		const uploadId = Number(event.params.upload_id);
		const response = await api.del({
			instanceId: event.locals.instance.id,
			uploadId
		});
		return json(response);
	} catch (err) {
		return error(
			500,
			'API:/api/v1/website/uploads/[upload_id]/:DELETE:01',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
