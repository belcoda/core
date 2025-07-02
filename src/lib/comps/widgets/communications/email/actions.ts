import { type List, list } from '$lib/schema/communications/email/messages';
import { parse } from '$lib/schema/valibot';
export async function load(search: string | null | undefined): Promise<List['items']> {
	const url = search
		? `/api/v1/communications/email?name=${search}`
		: '/api/v1/communications/email/messages';
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load: ${response.statusText}`);
	}
	const body = await response.json();
	const parsed = parse(list, body);
	return parsed.items;
}
