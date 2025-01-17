<script lang="ts">
	import '../../app.css';
	import { PUBLIC_UMAMI_WEBSITE_ID } from '$env/static/public';
</script>

<svelte:head>
	<script
		defer
		src="https://cloud.umami.is/script.js"
		data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
		data-tag="no_auth"
	></script>
</svelte:head>

<section class="min-h-screen flex items-center justify-center">
	<slot />
</section>
