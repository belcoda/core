/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("events")
    .alterTable("events", (t) => {
      t.text("timezone").notNullable().defaultTo("Etc/UTC");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema("events")
    .alterTable("events", (t) => {
      t.dropColumn("timezone");
    });
}; 