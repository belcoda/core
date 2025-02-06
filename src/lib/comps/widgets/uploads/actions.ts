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

export async function loadSingle(id: number): Promise<Read> {
	const response = await fetch(`/api/v1/website/uploads/${id}`);
	if (!response.ok) {
		throw new Error(`Failed to load: ${response.statusText}`);
	}
	const body = await response.json();
	const parsed = parse(read, body);
	return parsed;
}

export async function upload(
	data: { fileName: string; size: number; type: string; url: string },
	t: App.Localization
): Promise<Read> {
	const createFile: Create = {
		file_name: data.fileName,
		size: data.size,
		url: data.url,
		mime_type: data.type
	};
	const parsed = parse(create, createFile);
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
