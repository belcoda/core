import { json, error } from '$lib/server';
import { triggerAction } from '$lib/schema/communications/actions/actions';
import { parse } from '$lib/schema/valibot';
import { _getByAction } from '$lib/server/api/communications/whatsapp/messages.js';
import type { WhatsappInboundMessage } from '$lib/schema/communications/whatsapp/webhooks/ycloud';
import type { Read as Instance } from '$lib/schema/core/instance.js';
import type { SignupQueueMessage } from '$lib/schema/events/events';

export async function POST(event) {
	try {
		const body = await event.request.json();
		const parsed = parse(triggerAction, body);
		const { actions } = await _getByAction({
			t: event.locals.t,
			action: parsed.action_id
		});
		for (const action of actions) {
			switch (action.type) {
				case 'send_whatsapp_message': {
					// send message
					const messageToSend = {
						person_id: parsed.person_id,
						message_id: action.message_id,
						from_admin_id: event.locals.admin.id
					};
					await event.locals.queue(
						'/whatsapp/send_message',
						event.locals.instance.id,
						messageToSend,
						event.locals.admin.id
					);
					break;
				}
				case 'register_for_event': {
					const eventToRegisterFor = {
						event_id: action.event_id,
						person_id: parsed.person_id,
						from_admin_id: event.locals.admin.id,
						signup: getSignupQueueMessage(
							action.event_id,
							parsed.data as WhatsappInboundMessage,
							event.locals.instance
						)
					};
					await event.locals.queue(
						'/events/registration',
						event.locals.instance.id,
						eventToRegisterFor,
						event.locals.admin.id
					);
					break;
				}
				case 'sign_petition': {
					const petitionToSign = {
						petition_id: action.petition_id,
						signup: getSignupQueueMessage(
							action.petition_id,
							parsed.data as WhatsappInboundMessage,
							event.locals.instance
						)
					};
					await event.locals.queue(
						'/petitions/signature',
						event.locals.instance.id,
						petitionToSign,
						event.locals.admin.id
					);
					break;
				}
				//TODO: The rest of the actions
				default: {
					break;
				}
			}
		}
		return json({ success: true });
	} catch (err) {
		return error(
			500,
			'WORKER:/utils/communications/actions:01',
			event.locals.t.errors.http[500](),
			err
		);
	}
}

function getSignupQueueMessage(
	eventId: number,
	message: WhatsappInboundMessage,
	instance: Instance
): SignupQueueMessage {
	return {
		event_id: eventId,
		signup: {
			full_name: message.customerProfile?.name,
			phone_number: message.from,
			country: instance.country,
			opt_in: true,
			email: null
		}
	};
}
