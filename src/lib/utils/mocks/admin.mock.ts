import type { Read } from '$lib/schema/core/admin';

export const admin: Read = {
	id: 1,
	email: 'admin@example.com',
	full_name: 'Admin User',
	deleted_at: null,
	created_at: new Date('2024-03-19T10:00:00Z'),
	updated_at: new Date('2024-03-19T10:00:00Z'),
	profile_picture_url: null,
	active: true,
	permissions: ['all'],
	has_signed_in: false
};
