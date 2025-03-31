import { v, uuid } from '$lib/schema/valibot';
import { image, text, video, document } from '$lib/schema/communications/whatsapp/elements/media';

export const interactiveHeaders = {
	text: v.object({
		type: v.literal('text'),
		text: text
	}),
	image: v.object({
		type: v.literal('image'),
		image: image
	}),
	video: v.object({
		type: v.literal('video'),
		video: video
	}),
	document: v.object({
		type: v.literal('document'),
		document: document
	})
};

export const header = v.variant('type', [
	interactiveHeaders.text,
	interactiveHeaders.image,
	interactiveHeaders.video,
	interactiveHeaders.document
]);

export const action = v.object({
	buttons: v.pipe(
		v.array(
			v.object({
				type: v.literal('reply'),
				reply: v.object({
					title: v.pipe(v.string(), v.maxLength(20)),
					id: uuid
				})
			})
		),
		v.maxLength(3)
	)
});
export type Action = v.InferOutput<typeof action>;

export const interactive = v.object({
	action: action,
	type: v.picklist(['button']), //might add more options (eg: list, flow) later
	body: v.object({
		text: v.pipe(v.string(), v.maxLength(1024))
	}),
	footer: v.optional(
		v.object({
			text: v.pipe(v.string(), v.maxLength(60))
		})
	),
	header: v.optional(header)
});
