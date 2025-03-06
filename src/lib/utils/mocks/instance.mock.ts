import type { Read } from '$lib/schema/core/instance';

export const secrets = {
	WHATSAPP_ACCESS_KEY: 'test',
	RANDOM_KEY: 'random-key'
};

export const events = {
	default_template_id: 1,
	default_email_template_id: 2,
	default_event_info_settings: {
		ask_email: true,
		ask_phone_number: true,
		ask_postcode: true,
		ask_address: false,
		require_email: false,
		require_phone_number: false,
		require_postcode: false,
		require_address: false
	}
};

export const communications = {
	email: {
		default_from_name: 'Test',
		default_template_id: 3
	},
	whatsapp: {
		default_template_id: 4,
		phone_number_id: '+1234567890',
		business_account_id: null
	}
};

export const petitions = {
	default_template_id: 5
};

export const website = {
	default_template_id: 6,
	custom_domain: null,
	pages_content_type_id: 7,
	posts_content_type_id: 8,
	logo_url: 'https://example.com/logo.png',
	favicon: null,
	header_links: [],
	footer_links: []
};

export const settings = {
	default_admin_id: 1,
	home_page_url: 'localhost',
	events,
	communications,
	petitions,
	website
};

export const instance: Read = {
	id: 1,
	name: 'Test Instance',
	slug: 'test-instance',
	settings,
	owner_email: 'test@example.com',
	language: 'en',
	country: 'us',
	installed: true,
	created_at: new Date(),
	updated_at: new Date()
};
