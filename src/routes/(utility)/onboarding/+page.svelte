<script lang="ts">
	import { PUBLIC_HOST, PUBLIC_GOOGLE_AUTH_CLIENT_ID } from '$env/static/public';
	// Update the login_uri to include the continue parameter if it exists
	const loginUri = `${PUBLIC_HOST}/onboarding/auth/google`;
	import { page } from '$app/state';
	const error = page.url.searchParams.get('error') === 'true';
</script>

<svelte:head>
	<title>Belcoda - Start onboarding</title>
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

<div class="grid grid-cols-1 gap-3">
	<h1 class="text-3xl lg:text-4xl font-extrabold text-gray-800">Welcome to Belcoda</h1>
	{#if error}
		<div
			class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<strong class="font-bold">Error:</strong>
			<span class="block sm:inline"
				>We weren't able to create an account. The most common reason is that the email address of
				your Google Account already has an account account on Belcoda. If you're not sure, please
				try again with a different Google Account you have access to.</span
			>
		</div>
	{/if}
	<p class=" text-gray-600 text-base lg:text-lg">
		In order to get started, we need to ask you a few questions about you and your organization.
	</p>
	<p class=" text-gray-600 text-base lg:text-lg">
		Then, the system will automatically create a new organization for you, and you will be
		redirected to the organization dashboard.
	</p>
	<p class=" text-gray-600 text-base lg:text-lg">
		But before we continue, you need to create an account on Belcoda using your Google account.
	</p>
	<p class=" text-gray-600 text-base lg:text-lg">
		At the moment, Login With Google is the only way to login to the Belcoda platform, so you will
		need a Google account to continue.
	</p>
	<div class="flex justify-start my-4">
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
			data-theme="default"
			data-text="continue_with"
			data-size="large"
			data-logo_alignment="left"
		></div>
	</div>
</div>
