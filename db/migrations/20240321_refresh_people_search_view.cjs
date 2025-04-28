/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("people")
    .raw('DROP VIEW IF EXISTS people.people_search')
    .then(() => {
      return knex.schema.withSchema("people").raw(`
        CREATE VIEW people.people_search AS
        SELECT *,
          concat(full_name, ' ', given_name, ' ', family_name, ' ', email->>'email', ' ', phone_number->>'phone_number') AS search
        FROM people.people
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema("people")
    .raw('DROP VIEW IF EXISTS people.people_search')
    .then(() => {
      return knex.schema.withSchema("people").raw(`
        CREATE VIEW people.people_search AS
        SELECT *,
          concat(full_name, ' ', given_name, ' ', family_name, ' ', email->>'email', ' ', phone_number->>'phone_number') AS search
        FROM people.people
      `);
    });
}; 