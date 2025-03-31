import Handlebars from 'handlebars';
import { pino } from '$lib/server';
const log = pino(import.meta.url);
import { type Read } from '$lib/schema/website/blocks';
import { type Read as EventRead } from '$lib/schema/events/events';
import templateBlocks from '$lib/server/templates/website/blocks';
import { formatDateOnly, formatDateTimeRange } from '$lib/utils/text/date';
import { renderAddress } from '$lib/utils/text/address';
import { renderRegistrationLink } from '$lib/utils/text/whatsapp';
import { type Read as ReadInstance } from '$lib/schema/core/instance';
export default function (
	hb: typeof Handlebars,
	blocks: Read[],
	t: App.Localization,
	instance: ReadInstance
): typeof Handlebars {
	hb.registerHelper('date', function (date: string | Date) {
		if (typeof date === 'string') {
			date = new Date(date);
		}
		return formatDateOnly(date);
	});

	hb.registerHelper('GLOBAL_CURRENT_YEAR', function () {
		return new Date().getFullYear();
	});

	hb.registerHelper('render_event_time', function (event: EventRead) {
		return formatDateTimeRange(event.starts_at, event.ends_at);
	});
	hb.registerHelper('time', function (date: string | Date) {
		return new Date(date).toLocaleTimeString();
	});
	hb.registerHelper('address', function (itemBody: EventRead) {
		return renderAddress(itemBody, t, instance.country).text;
	});
	hb.registerHelper('google_maps_url', function (itemBody: EventRead) {
		return renderAddress(itemBody, t).url;
	});
	hb.registerHelper(
		'whatsapp_registration_url',
		function (instance: ReadInstance, event: EventRead) {
			return renderRegistrationLink(instance, event).url;
		}
	);
	hb.registerHelper('icon', function (icon: 'calendar' | 'mappin' | 'globe' | 'message-circle') {
		if (icon === 'calendar') {
			return new Handlebars.SafeString(
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>'
			);
		}
		if (icon === 'mappin') {
			return new Handlebars.SafeString(
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
			);
		}
		if (icon === 'globe') {
			return new Handlebars.SafeString(
				`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
			);
		}
		if (icon === 'message-circle') {
			return new Handlebars.SafeString(
				`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`
			);
		}
	});

	// Note that the user-defined blocks are loaded AFTER the hardcoded blocks
	// This means that users are able to overwrite hardcoded blocks with custom display and functionality.

	for (let i = 0; i < templateBlocks.length; i++) {
		const block = templateBlocks[i];
		const template = block.template;
		hb.registerPartial(`blocks.${block.name}`, template);
	}

	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];
		const template = `${block.custom_css ? `<style>${block.custom_css}</style>` : ''}${block.html}${block.custom_js ? `<script>${block.custom_js}</script>` : ''}`;
		hb.registerPartial(`blocks.${block.slug}`, template);
	}

	return hb;
}
