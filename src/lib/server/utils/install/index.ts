/**
 * Installs a new instance, optionally with test data.
 * @file src/lib/server/utils/install/index.ts
 * @author dmerope
 * @date 2024-12-05
 *
 * Can be invoked when the application runs for the first time, or when we want to create a new tennant/instance when a new group is added to the system.
 *
 */
import { DEFAULT_WHATAPP_ACCESS_KEY } from '$env/static/private';
import { pino } from '$lib/server';
import { parse } from '$lib/schema/valibot';
import type { SupportedCountry, SupportedLanguage } from '$lib/i18n';
export type InstallOptions = {
	instanceName: string;
	instanceSlug: string;
	ownerEmail: string;
	ownerName: string;
	ownerProfilePictureUrl?: string;
	logoUrl: string;
	faviconUrl?: string;
	country: SupportedCountry;
	language: SupportedLanguage;
	homePageUrl?: string;
	options: {
		testData: boolean;
	};
};

import {
	type Read as ReadInstance,
	create as createInstanceSchema
} from '$lib/schema/core/instance';

import {
	create as createInstance,
	_updateSetInstalled as _updateInstanceSetInstalled,
	update as updateInstance
} from '$lib/server/api/core/instances';
import { create as createAdmin } from '$lib/server/api/core/admins';

import createTemplates from '$lib/server/utils/install/templates/create_templates';
import createInstanceSettings from '$lib/server/utils/install/default_instance_settings';

import createTestData from '$lib/server/utils/install/data/test/testData';

const log = pino(import.meta.url);

export default async function install(
	options: InstallOptions,
	t: App.Localization,
	queue: App.Queue
): Promise<ReadInstance> {
	log.debug(`installing instance ${options.instanceName}`);
	const createInstanceBody = parse(createInstanceSchema, {
		name: options.instanceName,
		slug: options.instanceSlug,
		owner_email: options.ownerEmail,
		language: options.language,
		country: options.country,
		installed: false,
		settings: createInstanceSettings(options, t),
		secrets: {
			WHATSAPP_ACCESS_KEY: DEFAULT_WHATAPP_ACCESS_KEY
		}
	});
	const instance = await createInstance({ body: createInstanceBody, t });
	log.debug(`instance ${instance.id} created`);
	const admin = await createAdmin({
		instance_id: instance.id,
		body: {
			email: options.ownerEmail,
			full_name: options.ownerName,
			profile_picture_url: options.ownerProfilePictureUrl
		},
		queue
	});
	log.debug(`admin ${admin.id} created`);
	// because we're not including an admin ID above, we can use this admin ID to do the sanctions check now we've created the admin
	await queue('utils/people/match_sanction', instance.id, { adminId: admin.id }, admin.id);
	log.debug(`sanctions check queued for admin ${admin.id}`);

	// ➡️ Removed user-generated templates from the app. See: https://github.com/belcoda/core/tree/feature/improved_templates
	const templates = await createTemplates({ instance, t });
	log.debug(`templates created`);
	log.debug(templates);

	const newSettings = createInstanceSettings(options, t, templates, admin.id);
	log.debug(`new settings created`);
	log.debug(newSettings);
	const updatedInstance = await updateInstance({
		instanceId: instance.id,
		body: { settings: newSettings }
	});
	log.debug(`instance ${instance.id} updated`);

	//test data
	if (options.options.testData) {
		log.debug(`installing test data`);
		await createTestData({ instance: updatedInstance, admin, queue });
	}
	log.debug('updating instance to set installed to true');
	await _updateInstanceSetInstalled({
		instanceId: instance.id
	});
	log.debug(`install script complete`);

	return updatedInstance;
}
