import type { Read as Petition } from '$lib/schema/petitions/petitions';

const mockEmailMessage = {
	id: 1,
	name: 'Autoresponse',
	subject: 'Petition Signature',
	html: '',
	text: '',
	point_person_id: 1,
	created_at: new Date('2024-03-19T10:00:00Z'),
	updated_at: new Date('2024-03-19T10:00:00Z'),
	template_id: 1,
	from: 'test@example.com',
	reply_to: 'test@example.com',
	preview_text: '',
	use_html_for_plaintext: false
};

export const mockPetition: Petition = {
	id: 1,
	name: 'Test Petition',
	slug: 'test-petition',
	heading: 'Test Petition Heading',
	html: '<p>Test content</p>',
	petition_target: 'Test Target',
	petition_text: 'Test petition text',
	ask_email: true,
	ask_phone_number: true,
	ask_postcode: true,
	ask_address: true,
	require_email: true,
	require_phone_number: false,
	require_postcode: false,
	require_address: false,
	feature_image_upload_id: null,
	feature_image: null,
	send_autoresponse_email: true,
	point_person: {
		id: 1,
		email: 'admin@test.com',
		full_name: 'Test Admin',
		active: true,
		created_at: new Date('2024-03-19T10:00:00Z'),
		updated_at: new Date('2024-03-19T10:00:00Z'),
		profile_picture_url: null,
		permissions: ['all'],
		has_signed_in: false
	},
	autoresponse_email: mockEmailMessage,
	signatures: 0,
	custom_code: {
		custom_html_head: null,
		custom_html_body: null,
		custom_css: null,
		custom_js: null
	},
	html_metatags: {
		isManuallySet: false,
		title: null,
		description: null,
		subject: null,
		keywords: null,
		openGraph: {
			title: null,
			description: '',
			image: '',
			image_alt: ''
		},
		twitter: {
			title: null,
			description: '',
			image: '',
			image_alt: '',
			card: null
		}
	},
	template_id: 1,
	active: true,
	created_at: new Date('2024-03-19T10:00:00Z'),
	updated_at: new Date('2024-03-19T10:00:00Z'),
	published_at: new Date('2024-03-19T10:00:00Z')
};
