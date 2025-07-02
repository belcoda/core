import { redirect } from '@sveltejs/kit';
export async function load(event) {
	return redirect(302, '/communications/email/messages');
}
