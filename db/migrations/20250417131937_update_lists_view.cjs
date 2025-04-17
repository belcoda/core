/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("people")
    .dropView("list_view")
    .then(() => {
      return knex.schema.withSchema("people").createView("list_view", function (view) {
        view.columns([
          "id",
          "instance_id",
          "name",
          "ready",
          "perpetual",
          "created_at",
          "updated_at",
          "expires_at",
          "deleted_at",
          "count",
        ]);
        view.as(
          knex.raw(`
            SELECT
              l.*,
              COUNT(lp.person_id) AS count
            FROM
              people.lists l
            LEFT JOIN
              people.list_people lp
            ON
              l.id = lp.list_id
            GROUP BY
              l.id
          `)
        );
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema("people")
    .dropView("list_view")
    .then(() => {
      return knex.schema.withSchema("people").createView("list_view", function (view) {
        view.columns([
          "id",
          "instance_id",
          "name",
          "ready",
          "perpetual",
          "created_at",
          "updated_at",
          "expires_at",
          "count",
        ]);
        view.as(
          knex.raw(`
            SELECT
              l.*,
              COUNT(lp.person_id) AS count
            FROM
              people.lists l
            LEFT JOIN
              people.list_people lp
            ON
              l.id = lp.list_id
            GROUP BY
              l.id
          `)
        );
      });
    });
}; 