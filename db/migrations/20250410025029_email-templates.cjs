/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	// drop references to templates in email_messages
	await knex.schema.withSchema('communications').table('email_messages', function (t) {
		t.dropForeign('template_id');
	});
	await knex.raw(
		'ALTER TABLE communications.email_messages ALTER COLUMN template_id DROP NOT NULL'
	);
	await knex.schema.withSchema('communications').table('email_messages', function (t) {
		t.dropColumn('template_id');
		//add replacement column with template name (ie: in email gateway system)
		t.text('template_name').nullable(); //needs to be nullable to support existing messages
	});
	await knex('communications.email_messages').update({ template_name: 'main' }); //updated all existing messages
	await knex.raw(
		'ALTER TABLE communications.email_messages ALTER COLUMN template_name SET NOT NULL'
	);

	// now we can delete the templates
	await knex.schema.withSchema('communications').dropTableIfExists('email_templates'); //now possible, no other table references it

	// let's drop message_id from the sent_emails table because there is already send_id
	// message_id was just there because previously we were creating entries in the email_messages table for transactional emails like notifications
	// with this change, we won't be doing that anymore. As such, any message_id that is sent will also be referenced in the email_sends table, by the send_id.
	await knex.schema.withSchema('communications').table('sent_emails', function (t) {
		t.dropForeign('message_id');
	});
	await knex.raw('ALTER TABLE communications.sent_emails ALTER COLUMN message_id DROP NOT NULL');

	await knex.schema
		.withSchema('communications')
		.raw('CREATE DOMAIN "sent_email_details" AS "jsonb";');
	await knex.schema.withSchema('communications').table('sent_emails', function (t) {
		t.dropColumn('message_id');
		t.specificType('details', 'sent_email_details').nullable(); //details of the send (eg: 'event_reminder', 'eventId', etc)
	});

	//change event sttings which reference email messages
	await knex.schema.withSchema('events').table('events', function (t) {
		t.dropForeign('registration_email');
		t.dropForeign('reminder_email');
		t.dropForeign('cancellation_email');
		// we will keep the followup_email because it is still linked to an email message...
		// but we will need to make it nullable because it is not always set
	});
	await knex.raw('ALTER TABLE events.events ALTER COLUMN registration_email DROP NOT NULL');
	await knex.raw('ALTER TABLE events.events ALTER COLUMN reminder_email DROP NOT NULL');
	await knex.raw('ALTER TABLE events.events ALTER COLUMN cancellation_email DROP NOT NULL');
	await knex.raw('ALTER TABLE events.events ALTER COLUMN followup_email DROP NOT NULL'); //not for deleting, but just so that it is nullable

	await knex.schema.withSchema('events').table('events', function (t) {
		t.dropColumn('registration_email');
		t.dropColumn('reminder_email');
		t.dropColumn('cancellation_email');

		//now we need to create new settings relating to email notifications
		t.boolean('send_update_email').notNullable().defaultTo(true); //if event details change and the event is still in the future, send an email to all registered
		t.boolean('send_event_cancellation_email').notNullable().defaultTo(true); //if the event is deleted or cancelled, and the event is in the future, send an email to all registered
	});

	//change petition settings which reference email messages
	await knex.schema.withSchema('petitions').table('petitions', function (t) {
		t.dropForeign('autoresponse_email');
	});
	await knex.raw('ALTER TABLE petitions.petitions ALTER COLUMN autoresponse_email DROP NOT NULL');
	await knex.schema.withSchema('petitions').table('petitions', function (t) {
		t.dropColumn('autoresponse_email');
	});
};

exports.down = async function (knex) {
	// recreate email_templates
	await knex.schema.withSchema('communications').createTable('email_templates', function (t) {
		t.increments('id');
		t.integer('instance_id').notNullable().references('id').inTable('public.instances');
		t.text('name').notNullable();
		t.text('from').notNullable();
		t.text('reply_to').notNullable();
		t.text('subject').notNullable();
		t.text('preview_text').notNullable().defaultTo('');
		t.text('html').notNullable().defaultTo('');
		t.text('text').notNullable().defaultTo('');
		t.boolean('active').notNullable().defaultTo(true);
		t.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
		t.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
		t.unique(['instance_id', 'name']);
	});

	// update email_messages to link back to templates
	await knex.schema.withSchema('communications').table('email_messages', function (t) {
		t.dropColumn('template_name');
		t.integer('template_id')
			.unsigned()
			.references('id')
			.inTable('communications.email_templates')
			.onDelete('SET NULL');
	});
	await knex.raw(
		'ALTER TABLE communications.email_templates ALTER COLUMN template_id SET NOT NULL'
	);
	await knex.schema.withSchema('communications').table('email_messages', function (t) {
		t.foreign('template_id');
	});

	// revert sent_emails changes
	await knex.schema.withSchema('communications').table('sent_emails', function (t) {
		t.dropColumn('details');
		t.integer('message_id').unsigned().notNullable();
		t.foreign('message_id').references('id').inTable('communications.email_messages');
	});
	await knex.schema.withSchema('communications').raw('DROP DOMAIN IF EXISTS "sent_email_details";');

	// restore event email message columns
	await knex.schema.withSchema('events').table('events', function (t) {
		t.dropColumn('send_update_email');
		t.dropColumn('send_event_cancellation_email');
		t.integer('registration_email').unsigned();
		t.integer('reminder_email').unsigned();
		t.integer('cancellation_email').unsigned();
	});
	await knex.raw('ALTER TABLE events.events ALTER COLUMN followup_email SET NOT NULL');
	await knex.raw('ALTER TABLE events.events ALTER COLUMN registration_email SET NOT NULL');
	await knex.raw('ALTER TABLE events.events ALTER COLUMN reminder_email SET NOT NULL');
	await knex.raw('ALTER TABLE events.events ALTER COLUMN cancellation_email SET NOT NULL');
	await knex.schema.withSchema('events').table('events', function (t) {
		t.foreign('registration_email').references('id').inTable('communications.email_messages');
		t.foreign('reminder_email').references('id').inTable('communications.email_messages');
		t.foreign('cancellation_email').references('id').inTable('communications.email_messages');
	});

	// restore petition autoresponse_email
	await knex.schema.withSchema('petitions').table('petitions', function (t) {
		t.integer('autoresponse_email').unsigned();
	});
	await knex.raw('ALTER TABLE petitions.petitions ALTER COLUMN autoresponse_email SET NOT NULL');
	await knex.schema.withSchema('petitions').table('petitions', function (t) {
		t.foreign('autoresponse_email').references('id').inTable('communications.email_messages');
	});
};
