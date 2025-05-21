/* body: JSON.stringify({
  file_name: file.name
}) */
import { v } from '$lib/schema/valibot';
import { json, error } from '$lib/server';
import getSignedPutUrl from '$lib/server/utils/s3/put';
import { PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME } from '$env/static/public';
export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = v.parse(v.object({ file_name: v.string() }), body);
		const url = await getSignedPutUrl(
			PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME,
			parsed.file_name,
			3600
		);
		return json({ put_url: url });
	} catch (err) {
		console.error(err);
		return error(500, 'Error', 'Internal Server Error', err);
	}
}
