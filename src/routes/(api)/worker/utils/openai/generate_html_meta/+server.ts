import { json, error } from '$lib/server';
import { generateHtmlMetatags } from '$lib/server/utils/openai/schemas/HTMLMeta';
import { htmlMetatags } from '$lib/schema/utils/openai';
import { parse, htmlMetatags as htmlMetaTagSchema } from '$lib/schema/valibot';
import { read as readEvent, update as updateEvent } from '$lib/server/api/events/events';
import * as m from '$lib/paraglide/messages';
import {
	read as readPetition,
	update as updatePetition
} from '$lib/server/api/petitions/petitions';
import { read as readContent, update as updateContent } from '$lib/server/api/website/content';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(htmlMetatags, body);
		switch (parsed.type) {
			case 'event': {
				const eventObject = await readEvent({
					eventId: parsed.eventId,
					instanceId: event.locals.instance.id,
					t: event.locals.t
				});
				if (eventObject.html_metatags.isManuallySet === false) {
					const output = await generateHtmlMetatags(eventObject.heading, eventObject.html);
					const parsedOutput = parse(htmlMetaTagSchema, output);
					await updateEvent({
						instanceId: event.locals.instance.id,
						eventId: parsed.eventId,
						body: {
							html_metatags: {
								...eventObject.html_metatags,
								...parsedOutput
							}
						},
						queue: event.locals.queue,
						t: event.locals.t,
						// if we don't skip meta generation, this same queued job will be triggered again which will cause an infite loop
						skipMetaGeneration: true
					});
				}
				break;
			}
			case 'petition': {
				const petitionObject = await readPetition({
					instanceId: event.locals.instance.id,
					petitionId: parsed.petitionId
				});
				if (petitionObject.html_metatags.isManuallySet === false) {
					const output = await generateHtmlMetatags(petitionObject.heading, petitionObject.html);
					const parsedOutput = parse(htmlMetaTagSchema, output);
					await updatePetition({
						instanceId: event.locals.instance.id,
						petitionId: parsed.petitionId,
						body: {
							html_metatags: {
								...petitionObject.html_metatags,
								...parsedOutput
							}
						},
						queue: event.locals.queue,
						// if we don't skip meta generation, this same queued job will be triggered again which will cause an infite loop
						skipMetaGeneration: true
					});
				}
				break;
			}
			case 'content': {
				const contentObject = await readContent({
					instanceId: event.locals.instance.id,
					contentId: parsed.contentId,
					contentTypeId: parsed.contentTypeId,
					t: event.locals.t
				});
				if (contentObject.html_metatags.isManuallySet === false) {
					const output = await generateHtmlMetatags(contentObject.heading, contentObject.html);
					const parsedOutput = parse(htmlMetaTagSchema, output);
					await updateContent({
						instanceId: event.locals.instance.id,
						contentId: parsed.contentId,
						contentTypeId: parsed.contentTypeId,
						body: {
							html_metatags: {
								...contentObject.html_metatags,
								...parsedOutput
							}
						},
						queue: event.locals.queue,
						t: event.locals.t,
						// if we don't skip meta generation, this same queued job will be triggered again which will cause an infite loop
						skipMetaGeneration: true
					});
				}
				break;
			}
		}
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/worker/utils/openai/generate_html_meta/+server.ts',
			m.spry_ago_baboon_cure(),
			err
		);
	}
}
