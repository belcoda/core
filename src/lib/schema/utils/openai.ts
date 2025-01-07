import { v, id } from '$lib/schema/valibot';

export const htmlMetatagsOptions = {
	event: v.object({
		type: v.literal('event'),
		eventId: id
	}),
	petition: v.object({
		type: v.literal('petition'),
		petitionId: id
	}),
	content: v.object({
		type: v.literal('content'),
		contentId: id,
		contentTypeId: id
	})
};
export type EventHTMLMetaTags = v.InferOutput<typeof htmlMetatagsOptions.event>;
export type PetitionHTMLMetaTags = v.InferOutput<typeof htmlMetatagsOptions.petition>;
export type ContentHTMLMetaTags = v.InferOutput<typeof htmlMetatagsOptions.content>;

export const htmlMetatags = v.variant('type', [
	htmlMetatagsOptions.event,
	htmlMetatagsOptions.petition,
	htmlMetatagsOptions.content
]);
