export const instances = {
	id: 1,
	name: 'Test Instance',
	slug: 'belcoda-test',
	owner_email: 'django@belcoda.org',
	plan: 'free',
	language: 'en',
	country: 'us',
	installed: false,
	settings: {
		events: {
			default_email_template_id: 2,
			default_event_info_settings: {
				ask_email: true,
				ask_address: false,
				ask_postcode: true,
				require_email: false,
				require_address: false,
				ask_phone_number: true,
				require_postcode: false,
				require_phone_number: false
			}
		},
		website: {
			favicon: 'http://localhost:5173/logos/favicon.svg',
			logo_url: 'http://localhost:5173/logos/logo.svg',
			footer_links: [
				{ url: 'https://belcoda-test.localhost:5173', text: 'Home', new_tab: false },
				{ url: 'https://belcoda-test.localhost:5173/events', text: 'Events', new_tab: false }
			],
			header_links: [
				{ url: 'https://belcoda-test.localhost:5173', text: 'Home', new_tab: false },
				{ url: 'https://belcoda-test.localhost:5173/events', text: 'Events', new_tab: false }
			],
			custom_domain: null,
			pages_content_type_id: 1,
			posts_content_type_id: 2
		},
		petitions: {},
		home_page_url: 'https://belcoda-test.localhost:5173',
		communications: {
			email: {
				default_from_name: 'Test Instance <belcoda-test@localhost:5173>',
				default_template_id: 1
			},
			whatsapp: { phone_number: null, business_account_id: null, default_template_id: 1 }
		},
		default_admin_id: 1
	},
	secrets: {},
	created_at: '2025-03-14 19:32:52.946015+09',
	updated_at: '2025-03-14 19:32:52.946015+09'
};
