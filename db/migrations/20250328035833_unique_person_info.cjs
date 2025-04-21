exports.up = async function (knex) {
	await knex.schema.raw(`
    CREATE UNIQUE INDEX unique_instance_phone
    ON people.people (instance_id, (phone_number->>'phone_number'));
  `);
	await knex.schema.raw(`
    CREATE UNIQUE INDEX unique_instance_email
    ON people.people (instance_id, (email->>'email'));
  `);
};
exports.down = async function (knex) {
	await knex.schema.raw(`DROP INDEX IF EXISTS people.unique_instance_phone;`);
	await knex.schema.raw(`DROP INDEX IF EXISTS people.unique_instance_email;`);
};
