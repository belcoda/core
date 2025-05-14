import { parse } from '$lib/schema/valibot';
import { list as listFromSignatures } from '$lib/schema/communications/email/from_signatures';

export async function load(event) {
	const result = await event.fetch(`/api/v1/communications/email/from_signatures`);
	const parsedResult = parse(listFromSignatures, await result.json());
	return { from_signatures: parsedResult };
}
