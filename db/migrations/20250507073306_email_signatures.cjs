exports.up = async function (knex) {
	await knex.schema.withSchema('communications').createTable('email_from_signatures', function (t) {
		t.increments('id').primary();
		t.integer('instance_id').notNullable().references('id').inTable('public.instances');
		t.string('name').notNullable();
		t.string('email').notNullable();
		t.string('external_id').notNullable(); // This will come from Postmark, or a different email provider
		t.boolean('verified').notNullable().defaultTo(false);
		t.string('return_path_domain');
		t.boolean('return_path_domain_verified').notNullable().defaultTo(false);
		t.timestamp('created_at').defaultTo(knex.fn.now());
		t.timestamp('updated_at').defaultTo(knex.fn.now());
		t.timestamp('deleted_at');
	});
	await knex.schema.withSchema('communications').table('email_messages', function (t) {
		t.integer('from_signature_id').references('id').inTable('communications.email_from_signatures');
	});
};

exports.down = async function (knex) {
	await knex.schema.withSchema('communications').table('email_messages', function (t) {
		t.dropColumn('from_signature_id');
	});
	await knex.schema.withSchema('communications').dropTableIfExists('email_from_signatures');
};
