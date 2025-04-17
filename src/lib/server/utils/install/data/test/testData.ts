import { pino } from '$lib/server';
const log = pino(import.meta.url);
import { parse } from '$lib/schema/valibot';
import { create as createEvent } from '$lib/server/api/events/events';
import { create as createPetition } from '$lib/server/api/petitions/petitions';
import { create as createSend } from '$lib/server/api/communications/email/sends';

import { create as createTag } from '$lib/server/api/core/tags';
import { create as createList } from '$lib/server/api/people/lists';
import { create as createGroup } from '$lib/server/api/people/groups';
import { _updateSetInstalled } from '$lib/server/api/core/instances';

import { list as listPeople } from '$lib/server/api/people/people';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';

import createTestPeople from '$lib/server/utils/install/data/test/users/index';
import { create as createPerson } from '$lib/server/api/people/people';

import { type Create as CreateEvent, create as createEventSchema } from '$lib/schema/events/events';
import {
	type Create as CreatePetition,
	create as createPetitionSchema
} from '$lib/schema/petitions/petitions';
import { create as createSendSchema } from '$lib/schema/communications/email/sends';
import { type Read as ReadInstance } from '$lib/schema/core/instance';
import { type Read as ReadAdmin } from '$lib/schema/core/admin';
import { PUBLIC_HOST } from '$env/static/public';
export default async function ({
	instance,
	admin,
	t,
	queue
}: {
	t: App.Localization;
	instance: ReadInstance;
	admin: ReadAdmin;
	queue: App.Queue;
}): Promise<void> {
	log.debug('Installing test data');

	const createdPeople = createTestPeople({
		instanceId: instance.id,
		adminPointPersonId: admin.id,
		type: 'us'
	});
	for (const person of createdPeople) {
		await createPerson({
			instance_id: instance.id,
			admin_id: admin.id,
			body: person,
			queue,
			method: 'manual'
		});
	}

	const onlineEventBody: CreateEvent = parse(createEventSchema, {
		name: 'Test online event',
		slug: 'test_online_event',
		heading: 'Online Training: How to use Belcoda',
		html: `<p>Urna mattis hendrerit hendrerit dictumst elit volutpat nisl justo taciti congue. Natoque odio, etiam potenti sodales. Ad senectus dictum phasellus orci fermentum leo ac morbi netus. Vestibulum ornare, orci viverra felis posuere etiam class congue gravida tincidunt fames amet? Ligula malesuada faucibus imperdiet quis parturient ridiculus non pharetra. Ultrices non platea erat nec leo rutrum dictum nascetur mus sed sodales. Molestie ad magna risus eget aliquam duis.</p>
<p>Montes suspendisse consequat potenti? Ridiculus elementum vivamus arcu penatibus. Leo habitasse duis magna magnis. Aptent et risus curae;. Leo accumsan massa nullam tortor montes interdum gravida eleifend sit aliquet ullamcorper eget. Suscipit primis ligula elit dictum dignissim. Fusce conubia purus dictumst eget dolor at ridiculus penatibus class risus pulvinar dignissim. Massa quam.</p>
<p>Ullamcorper tortor hac, rutrum consectetur sodales semper. Primis nullam dis metus nisl donec! Quam vitae gravida ipsum maecenas mauris lorem auctor sagittis donec nostra. Neque quam sollicitudin consequat nibh praesent fames, vivamus fringilla. Vulputate arcu posuere purus natoque nisi platea erat consequat nam nec. Eu suspendisse hendrerit ad gravida quis curabitur. Montes; fermentum convallis vehicula. Posuere pulvinar dictum tincidunt senectus platea morbi.</p>
<p>Est et; fusce potenti porta. Feugiat eleifend viverra lacinia per ultrices fringilla adipiscing velit. Urna, enim viverra conubia platea volutpat urna lacinia lacinia torquent curabitur torquent! In sem rutrum himenaeos felis hac. Pharetra rhoncus egestas montes urna nascetur himenaeos consequat mi justo. Ante diam, non nascetur mattis nascetur id libero lobortis class porta. Fermentum mus mus sociis ac cubilia id et.</p>`,
		starts_at: getTimeTwoWeeksFromNow(17, 30),
		ends_at: getTimeTwoWeeksFromNow(19, 30),
		online: true,
		online_url: 'https://zoom.us/j/123456789'
	});
	const onlineEvent = await createEvent({
		instanceId: instance.id,
		body: onlineEventBody,
		adminId: admin.id,
		t: t,
		defaultEmailTemplateId: instance.settings.events.default_email_template_id,
		queue: queue
	});

	const inPersonEventBody: CreateEvent = parse(createEventSchema, {
		name: 'Test event',
		slug: 'test_event',
		heading: 'Discussion: The Future of Work',
		html: `<p>Urna mattis hendrerit hendrerit dictumst elit volutpat nisl justo taciti congue. Natoque odio, etiam potenti sodales. Ad senectus dictum phasellus orci fermentum leo ac morbi netus. Vestibulum ornare, orci viverra felis posuere etiam class congue gravida tincidunt fames amet? Ligula malesuada faucibus imperdiet quis parturient ridiculus non pharetra. Ultrices non platea erat nec leo rutrum dictum nascetur mus sed sodales. Molestie ad magna risus eget aliquam duis.</p>
<p>Montes suspendisse consequat potenti? Ridiculus elementum vivamus arcu penatibus. Leo habitasse duis magna magnis. Aptent et risus curae;. Leo accumsan massa nullam tortor montes interdum gravida eleifend sit aliquet ullamcorper eget. Suscipit primis ligula elit dictum dignissim. Fusce conubia purus dictumst eget dolor at ridiculus penatibus class risus pulvinar dignissim. Massa quam.</p>
<p>Ullamcorper tortor hac, rutrum consectetur sodales semper. Primis nullam dis metus nisl donec! Quam vitae gravida ipsum maecenas mauris lorem auctor sagittis donec nostra. Neque quam sollicitudin consequat nibh praesent fames, vivamus fringilla. Vulputate arcu posuere purus natoque nisi platea erat consequat nam nec. Eu suspendisse hendrerit ad gravida quis curabitur. Montes; fermentum convallis vehicula. Posuere pulvinar dictum tincidunt senectus platea morbi.</p>
<p>Est et; fusce potenti porta. Feugiat eleifend viverra lacinia per ultrices fringilla adipiscing velit. Urna, enim viverra conubia platea volutpat urna lacinia lacinia torquent curabitur torquent! In sem rutrum himenaeos felis hac. Pharetra rhoncus egestas montes urna nascetur himenaeos consequat mi justo. Ante diam, non nascetur mattis nascetur id libero lobortis class porta. Fermentum mus mus sociis ac cubilia id et.</p>`,
		starts_at: getTimeTwoWeeksFromNow(18, 30),
		ends_at: getTimeTwoWeeksFromNow(21, 0),
		online: false,
		address_line_1: 'The Old Vic',
		address_line_2: '103 The Cut',
		locality: 'London',
		postcode: 'SE1 8NB'
	});

	const inPersonEvent = await createEvent({
		instanceId: instance.id,
		body: inPersonEventBody,
		adminId: admin.id,
		t: t,
		defaultEmailTemplateId: instance.settings.events.default_email_template_id,
		queue: queue
	});

	const petitionBody: CreatePetition = parse(createPetitionSchema, {
		name: 'Test Petition',
		slug: 'test_petition',
		heading: 'Sign the People’s Pledge for Renters!',
		petition_target: 'To the Prime Minister',
		petition_text:
			'We, the undersigned, call upon the Prime Minister to immediately give all renters the legal and economic rights they deserve.',
		html: `<p> Urna mattis hendrerit hendrerit dictumst elit volutpat nisl justo taciti congue. Natoque odio, etiam potenti sodales. Ad senectus dictum phasellus orci fermentum leo ac morbi netus. Vestibulum ornare, orci viverra felis posuere etiam class congue gravida tincidunt fames amet? Ligula malesuada faucibus imperdiet quis parturient ridiculus non pharetra. Ultrices non platea erat nec leo rutrum dictum nascetur mus sed sodales. Molestie ad magna risus eget aliquam duis.</p>
<p>Montes suspendisse consequat potenti? Ridiculus elementum vivamus arcu penatibus. Leo habitasse duis magna magnis. Aptent et risus curae;. Leo accumsan massa nullam tortor montes interdum gravida eleifend sit aliquet ullamcorper eget. Suscipit primis ligula elit dictum dignissim. Fusce conubia purus dictumst eget dolor at ridiculus penatibus class risus pulvinar dignissim. Massa quam.</p>
<p>Ullamcorper tortor hac, rutrum consectetur sodales semper. Primis nullam dis metus nisl donec! Quam vitae gravida ipsum maecenas mauris lorem auctor sagittis donec nostra. Neque quam sollicitudin consequat nibh praesent fames, vivamus fringilla. Vulputate arcu posuere purus natoque nisi platea erat consequat nam nec. Eu suspendisse hendrerit ad gravida quis curabitur. Montes; fermentum convallis vehicula. Posuere pulvinar dictum tincidunt senectus platea morbi.</p>
<p>Est et; fusce potenti porta. Feugiat eleifend viverra lacinia per ultrices fringilla adipiscing velit. Urna, enim viverra conubia platea volutpat urna lacinia lacinia torquent curabitur torquent! In sem rutrum himenaeos felis hac. Pharetra rhoncus egestas montes urna nascetur himenaeos consequat mi justo. Ante diam, non nascetur mattis nascetur id libero lobortis class porta. Fermentum mus mus sociis ac cubilia id et.</p>`
	});

	const petition = await createPetition({
		instanceId: instance.id,
		body: petitionBody,
		adminId: admin.id,
		queue
	});

	const emailSendBody = parse(createSendSchema, {
		name: 'Test email send'
	});
	await createSend({
		instanceId: instance.id,
		body: emailSendBody,
		adminId: admin.id,
		defaultTemplateId: instance.settings.communications.email.default_template_id,
		t: t,
		queue
	});

	await createTag({ instanceId: instance.id, body: { name: 'topic:energy' } });
	await createTag({ instanceId: instance.id, body: { name: 'topic:agriculture' } });
	await createTag({ instanceId: instance.id, body: { name: 'topic:fisheries' } });
	await createTag({ instanceId: instance.id, body: { name: 'topic:women' } });
	await createTag({ instanceId: instance.id, body: { name: 'topic:forestry' } });
	await createTag({ instanceId: instance.id, body: { name: 'circle:core' } });
	await createTag({ instanceId: instance.id, body: { name: 'circle:active' } });
	await createTag({ instanceId: instance.id, body: { name: 'circle:inactive' } });
	await createTag({ instanceId: instance.id, body: { name: 'volunteer' } });
	await createTag({ instanceId: instance.id, body: { name: 'donor' } });
	await createTag({
		instanceId: instance.id,
		body: { name: 'attended:231011climatecamp' }
	});

	await createList({
		instanceId: instance.id,
		body: { name: 'Test list' },
		t: t
	});
	await createGroup({
		instanceId: instance.id,
		body: { name: 'Test group' },
		t: t,
		adminId: admin.id,
		url: new URL(PUBLIC_HOST)
	});

	await _updateSetInstalled({
		instanceId: instance.id
	});
	instance.installed = true;

	const people = await listPeople({
		instance_id: instance.id,
		url: new URL(PUBLIC_HOST),
		notPaged: true
	});
	for (let index = 0; index < people.items.length; index++) {
		const element = people.items[index];
		await queueInteraction({
			instanceId: instance.id,
			personId: element.id,
			adminId: admin.id,
			details: {
				type: 'person_added',
				details: {
					method: 'manual'
				}
			},
			queue: queue
		});
	}
	log.debug('Installed test data');
}

function getTimeTwoWeeksFromNow(hours: number, minutes: number): Date {
	// Create a date object for the current date and time
	const now = new Date();

	// Calculate the date two weeks from now
	const twoWeeksFromNow = new Date(now);
	twoWeeksFromNow.setDate(now.getDate() + 14);

	// Set the time to 8:30 PM (20:30)
	twoWeeksFromNow.setHours(hours);
	twoWeeksFromNow.setMinutes(minutes);
	twoWeeksFromNow.setSeconds(0);
	twoWeeksFromNow.setMilliseconds(0);

	// Return the ISO string
	return twoWeeksFromNow;
}
