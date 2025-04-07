exports.up = async function (knex) {
	await knex.schema.raw(`DROP VIEW IF EXISTS people.people_search;`);
	await knex.schema.alterTable('people.people', async (table) => {
		table.text('gender').nullable();
		table.date('dob').alter();
	});
	await knex.schema.withSchema('people').raw(`
    CREATE VIEW people.people_search AS
    SELECT *,
      concat(full_name, ' ', given_name, ' ', family_name, ' ', email->>'email', ' ', phone_number->>'phone_number') AS search
    FROM people.people
  `);
};

exports.down = async function (knex) {
	await knex.schema.raw(`DROP VIEW IF EXISTS people.people_search;`);
	await knex.schema.alterTable('people.people', (table) => {
		table.dropColumn('gender');
		table.timestamp('dob', { useTz: true }).alter();
	});
	await knex.schema.withSchema('people').raw(`
      CREATE VIEW people.people_search AS
      SELECT *,
        concat(full_name, ' ', given_name, ' ', family_name, ' ', email->>'email', ' ', phone_number->>'phone_number') AS search
      FROM people.people
    `);
};
