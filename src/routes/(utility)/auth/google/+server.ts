import { redirect } from '@sveltejs/kit';
import { verify } from './verifyIdToken.js';
import { signIn } from '$lib/server/api/core/admins.js';
import { signIn as validateSignIn } from '$lib/schema/core/admin';
import { parse } from '$lib/schema/valibot';
import { COOKIE_SESSION_NAME } from '$env/static/private';
import { Localization } from '$lib/i18n';
import { BelcodaError } from '$lib/server';

export const POST = async function (event) {
	try {
		const tokenCookie = event.cookies.get('g_csrf_token');
		const continueUrl = event.url.searchParams.get('continue');
		const body = await event.request.formData();
		const tokenBody = body.get('g_csrf_token');
		const credential = body.get('credential');
		if (!tokenCookie) throw new Error('CSRF token not found in request headers');
		if (!tokenBody) throw new Error('CSRF token not found in request body');
		if (tokenCookie !== tokenBody) throw new Error('Token mismatch. Unable to authenticate.');
		if (typeof credential !== 'string') throw new Error('Invalid credential');
		const signInDetails = await verify(credential);
		const parsedSignInDetails = parse(validateSignIn, signInDetails);
		const { session, admin } = await signIn({
			t: new Localization(event.locals.language),
			body: parsedSignInDetails
		});
		event.cookies.set(COOKIE_SESSION_NAME, session, { path: '/' });
		return redirect(302, continueUrl ? continueUrl : '/');
	} catch (err) {
		if (err instanceof Error) {
			throw new BelcodaError(
				500,
				'API01:/AUTH/GOOGLE:POST:01',
				event.locals.t.errors.http[500](),
				err
			);
		} else {
			throw err;
		}
	}
};
