exports.up = async function (knex) {
	// Get the default event template
	const [eventTemplate] = await knex('website.templates')
		.where({ name: 'Event' })
		.select('id', 'html');

	if (eventTemplate) {
		// Add the WhatsApp registration button before the form in the event template
		const updatedEventHtml = eventTemplate.html.replace(
			'{{#if status.error}}',
			`
        <div class="flex items-center gap-2 mt-4">
          <div class="font-bold">{{icon "message-circle"}}</div>
          <div class="">
            <a href="{{whatsapp_registration_url instance event}}" target="_blank" class="hover:brightness-110">Register via WhatsApp</a>
          </div>
        </div>

        {{#if status.error}}`
		);

		// Update the event template in the database
		await knex('website.templates')
			.where({ id: eventTemplate.id })
			.update({ html: updatedEventHtml });
	} else {
		console.log('No event template found');
	}

	// Update the petition template
	const [petitionTemplate] = await knex('website.templates')
		.where({ name: 'Petition' })
		.select('id', 'html');

	if (petitionTemplate) {
		const updatedPetitionHtml = petitionTemplate.html.replace(
			'{{#if status.error}}',
			`
        <div class="flex items-center gap-2 mt-4">
          <div class="font-bold">{{icon "message-circle"}}</div>
          <div class="">
            <a href="{{whatsapp_registration_url instance petition}}" target="_blank" class="hover:brightness-110">Sign via WhatsApp</a>
          </div>
        </div>

        {{#if status.error}}`
		);

		await knex('website.templates')
			.where({ id: petitionTemplate.id })
			.update({ html: updatedPetitionHtml });
	} else {
		console.log('No petition template found');
	}
};

exports.down = async function (knex) {
	// event template
	const [eventTemplate] = await knex('website.templates')
		.where({ name: 'Event' })
		.select('id', 'html');

	if (eventTemplate) {
		// Remove the WhatsApp registration button from the event template
		const originalEventHtml = eventTemplate.html.replace(
			/\s*<div class="flex items-center gap-2 mt-4">\s*<div class="font-bold">{{icon "message-circle"}}<\/div>\s*<div class="">\s*<a href="{{whatsapp_registration_url instance event}}" target="_blank" class="hover:brightness-110">Register via WhatsApp<\/a>\s*<\/div>\s*<\/div>\s*/,
			''
		);

		await knex('website.templates')
			.where({ id: eventTemplate.id })
			.update({ html: originalEventHtml });
	} else {
		console.log('No event template found');
	}

	// petition template
	const [petitionTemplate] = await knex('website.templates')
		.where({ name: 'Petition' })
		.select('id', 'html');

	if (petitionTemplate) {
		// Remove the WhatsApp registration button
		const originalPetitionHtml = petitionTemplate.html.replace(
			/\s*<div class="flex items-center gap-2 mt-4">\s*<div class="font-bold">{{icon "message-circle"}}<\/div>\s*<div class="">\s*<a href="{{whatsapp_registration_url instance petition}}" target="_blank" class="hover:brightness-110">Sign via WhatsApp<\/a>\s*<\/div>\s*<\/div>\s*/,
			''
		);

		await knex('website.templates')
			.where({ id: petitionTemplate.id })
			.update({ html: originalPetitionHtml });
	} else {
		console.log('No petition template found');
	}
};
