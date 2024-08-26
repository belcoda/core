import { type List, type Create, list, create, read, type Read } from '$lib/schema/website/uploads';
import { parse } from '$lib/schema/valibot';

export async function load(search: string | null | undefined): Promise<List> {
	const url = search ? `/api/v1/website/uploads?file_name=${search}` : '/api/v1/website/uploads';
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load: ${response.statusText}`);
	}
	const body = await response.json();
	const parsed = parse(list, body);
	return parsed;
}

function parseUnknownData(data: unknown, t: App.Localization): Create {
	try {
		const parsed = parse(create, {
			// @ts-ignore - we're parsing anyway
			file_name: data.file_name || '',
			// @ts-ignore - we're parsing anyway
			size: data.size,
			// @ts-ignore - we're parsing anyway
			url: data.url,
			// @ts-ignore - we're parsing anyway
			mime_type: data.mimeType
		});
		return parsed;
	} catch (err) {
		throw new Error(t.errors.creating_data());
	}
}

export async function upload(data: unknown, t: App.Localization): Promise<Read> {
	const parsed = parseUnknownData(data, t);
	const response = await fetch('/api/v1/website/uploads', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(parsed)
	});
	if (!response.ok) {
		throw new Error(`Failed to upload: ${response.statusText}`);
	}
	const body = await response.json();
	const parsedBody = parse(read, body);
	return parsedBody;
}