import { redis, db, pool, error, pino } from '$lib/server';

const log = pino(import.meta.url);

import * as schemaSession from '$lib/schema/core/session';
import * as schemaAdmin from '$lib/schema/core/admin';
import * as schemaInstance from '$lib/schema/core/instance';
import { v } from '$lib/schema/valibot';

import { read as readAdmin } from '$lib/server/api/core/admins';
import { read as readInstance } from '$lib/server/api/core/instances';

export const create = async ({
	instance_id,
	admin_id
}: {
	instance_id: number;
	admin_id: number;
}): Promise<schemaSession.Read> => {
	const session = v.parse(schemaSession.create, { admin_id, instance_id });
	const created = await db.insert('sessions', session).run(pool);
	const createdParsed = v.parse(schemaSession.read, created);
	return createdParsed;
};

export const del = async ({ code }: { code: string }): Promise<void> => {
	await db.update('sessions', { expires_at: db.sql`now()` }, { code: code }).run(pool);
};

export const read = async ({
	code,
	t
}: {
	code: string;
	t: App.Localization;
}): Promise<{ admin: schemaAdmin.Read; instance: schemaInstance.Read }> => {
	const session = await db
		.selectExactlyOne('sessions', { code, expires_at: db.conditions.after(db.sql`now()`) })
		.run(pool);
	try {
		const admin = await readAdmin({
			instance_id: session.instance_id,
			admin_id: session.admin_id,
			t
		});

		const instance = await readInstance({ instance_id: session.instance_id });

		const parsedAdmin = v.parse(schemaAdmin.read, admin);

		const parsedInstance = v.parse(schemaInstance.read, instance);

		return {
			admin: parsedAdmin,
			instance: parsedInstance
		};
	} catch (err) {
		log.error(err);
		throw new Error('Error processing session data');
	}
};
