<script lang="ts">
	import { PUBLIC_HOST, PUBLIC_GOOGLE_AUTH_CLIENT_ID } from '$env/static/public';
	import H2 from '$lib/comps/typography/H2.svelte';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	// Update the login_uri to include the continue parameter if it exists
	$: continueUrl = $page.url.searchParams.get('continue');
	$: loginUri = continueUrl
		? `${PUBLIC_HOST}/auth/google?continue=${continueUrl}`
		: `${PUBLIC_HOST}/auth/google`;
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

<div class="flex justify-center flex-wrap w-screen h-screen items-center bg-gray-100">
	<div>
		<div class="border p-4 shadow bg-white">
			<div class="text-center">
				<div class="flex justify-center my-2">
					<img src="/logos/logomark.svg" alt="Belcoda icon" />
				</div>
				<H2>{m.top_dark_turkey_push()}</H2>
				<p class="text-muted-foreground mt-2 mb-4">{m.weak_curly_beaver_belong()}</p>
			</div>

			<div class="flex justify-center">
				<div
					id="g_id_onload"
					data-client_id={PUBLIC_GOOGLE_AUTH_CLIENT_ID}
					data-context="signin"
					data-ux_mode="popup"
					data-login_uri={loginUri}
					data-auto_prompt="false"
				></div>

				<div
					class="g_id_signin"
					data-type="standard"
					data-shape="rectangular"
					data-theme="outline"
					data-text="signin_with"
					data-size="medium"
					data-logo_alignment="left"
				></div>
			</div>
		</div>
		<div class="h-20 mt-2 text-center text-xs text-muted-foreground">
			&copy; {new Date().getFullYear()} Belcoda
		</div>
	</div>
</div>
