/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return (
		knex.schema
			// public schema
			.alterTable('public.admins', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			// communications schema
			.alterTable('communications.email_messages', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			.alterTable('communications.whatsapp_threads', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			.alterTable('communications.whatsapp_messages', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			.alterTable('communications.whatsapp_templates', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			// events schema
			.alterTable('events.events', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			// people schema
			.alterTable('people.people', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			.alterTable('people.groups', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			.alterTable('people.lists', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			// 	petitions schema
			.alterTable('petitions.petitions', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			// website schema
			.alterTable('website.content', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
			.alterTable('website.uploads', (table) => {
				table.timestamp('deleted_at', { useTz: true }).nullable().index();
			})
	);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return (
		knex.schema
			// public schema
			.alterTable('public.admins', (table) => {
				table.dropColumn('deleted_at');
			})
			// communications schema
			.alterTable('communications.email_messages', (table) => {
				table.dropColumn('deleted_at');
			})
			.alterTable('communications.whatsapp_threads', (table) => {
				table.dropColumn('deleted_at');
			})
			.alterTable('communications.whatsapp_messages', (table) => {
				table.dropColumn('deleted_at');
			})
			.alterTable('communications.whatsapp_templates', (table) => {
				table.dropColumn('deleted_at');
			})
			// events schema
			.alterTable('events.events', (table) => {
				table.dropColumn('deleted_at');
			})
			// people schema
			.alterTable('people.people', (table) => {
				table.dropColumn('deleted_at');
			})
			.alterTable('people.groups', (table) => {
				table.dropColumn('deleted_at');
			})
			.alterTable('people.lists', (table) => {
				table.dropColumn('deleted_at');
			})
			// 	petitions schema
			.alterTable('petitions.petitions', (table) => {
				table.dropColumn('deleted_at');
			})
			// website schema
			.alterTable('website.content', (table) => {
				table.dropColumn('deleted_at');
			})
			.alterTable('website.uploads', (table) => {
				table.dropColumn('deleted_at');
			})
	);
};
