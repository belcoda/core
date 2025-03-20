const { custom_code, html_metatags } = require('../data/globals.cjs');
exports.up = async function (knex) {
	await knex.schema.withSchema('website').alterTable('content', (t) => {
		t.dropForeign('template_id');
	});
	await knex.raw('ALTER TABLE website.content ALTER COLUMN template_id DROP NOT NULL');
	await knex.schema.withSchema('website').alterTable('content', (t) => {
		t.dropColumn('template_id');
	});

	await knex.schema.withSchema('petitions').alterTable('petitions', (t) => {
		t.dropForeign('template_id');
	});
	await knex.raw('ALTER TABLE petitions.petitions ALTER COLUMN template_id DROP NOT NULL');
	await knex.schema.withSchema('petitions').alterTable('petitions', (t) => {
		t.dropColumn('template_id');
	});

	await knex.schema.withSchema('events').alterTable('events', (t) => {
		t.dropForeign('template_id');
	});
	await knex.raw('ALTER TABLE events.events ALTER COLUMN template_id DROP NOT NULL');
	await knex.schema.withSchema('events').alterTable('events', (t) => {
		t.dropColumn('template_id');
	});

	await knex.schema.withSchema('website').alterTable('content_types', (t) => {
		t.dropForeign('collection_template_id');
	});
	await knex.raw(
		'ALTER TABLE website.content_types ALTER COLUMN collection_template_id DROP NOT NULL'
	);
	await knex.schema.withSchema('website').alterTable('content_types', (t) => {
		t.dropColumn('collection_template_id');
	});

	await knex.schema.withSchema('website').alterTable('content_types', (t) => {
		t.dropForeign('content_template_id');
	});
	await knex.raw(
		'ALTER TABLE website.content_types ALTER COLUMN content_template_id DROP NOT NULL'
	);
	await knex.schema.withSchema('website').alterTable('content_types', (t) => {
		t.dropColumn('content_template_id');
	});

	await knex.schema.dropTable('website.templates');
};

exports.down = async function (knex) {
	await knex.schema.withSchema('website').createTable('templates', (t) => {
		t.increments('id');
		t.integer('instance_id').notNullable().references('id').inTable('public.instances');
		t.text('name').notNullable();
		t.text('description').nullable();
		t.text('html').notNullable().defaultTo('');
		t.specificType('custom_code', 'custom_code').notNullable().defaultTo(custom_code);
		t.specificType('html_metatags', 'html_metatags').notNullable().defaultTo(html_metatags);
		t.boolean('active').notNullable().defaultTo(true);
		t.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
		t.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
	});

	// this is necessary in order to be able to recreate the template_id values in the following fields with a NOT NULL constraint
	// (since the template_id column is being recreated with a default value of 1, it must be present in the database).
	// I don't know if there's a better way of doing this (I'm super open to it!!), but for now this is the only way I could think of.
	// I'm sorry for the inconvenience. It will probbaly require a bit of tweaking and testing when doing down migrations/resets.
	await knex('website.templates').insert([
		{
			instance_id: 1,
			name: 'Default',
			description: 'Default template',
			html: '',
			custom_code: custom_code,
			html_metatags: html_metatags,
			active: true
		}
	]);

	await knex.schema.withSchema('website').alterTable('content', (t) => {
		t.integer('template_id').notNullable().default(1);
		t.foreign('template_id').references('id').inTable('website.templates');
	});

	await knex.schema.withSchema('petitions').alterTable('petitions', (t) => {
		t.integer('template_id').notNullable().default(1);
		t.foreign('template_id').references('id').inTable('website.templates');
	});

	await knex.schema.withSchema('events').alterTable('events', (t) => {
		t.integer('template_id').notNullable().default(1);
		t.foreign('template_id').references('id').inTable('website.templates');
	});

	await knex.schema.withSchema('website').alterTable('content_types', (t) => {
		t.integer('collection_template_id').notNullable().default(1);
		t.foreign('collection_template_id').references('id').inTable('website.templates');
	});

	await knex.schema.withSchema('website').alterTable('content_types', (t) => {
		t.integer('content_template_id').notNullable().default(1);
		t.foreign('content_template_id').references('id').inTable('website.templates');
	});
};
