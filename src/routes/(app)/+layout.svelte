<script lang="ts">
	import MainNav from '$lib/comps/nav/menu-bar.svelte';
	import BottomNav from '$lib/comps/nav/mobile/bottom-nav.svelte';
	import Sidebar from '$lib/comps/nav/desktop/sidebar.svelte';
	import Breadcrumb from '$lib/comps/nav/breadcrumbs/breadcrumbs.svelte';
	import Footer from '$lib/comps/nav/footer/footer.svelte';
	import { page } from '$app/state';
	import {
		breadcrumbs as breadcrumbsConstructor,
		renderBreadcrumb
	} from '$lib/comps/nav/breadcrumbs/breadcrumbs';
	import { getLocale } from '$lib/paraglide/runtime';
	import { PUBLIC_UMAMI_WEBSITE_ID } from '$env/static/public';
	import * as Sentry from '@sentry/sveltekit';
	import { browser } from '$app/environment';
	if (browser) {
		Sentry.init({
			dsn: 'https://8b4cdb05d7907fe3f9b43aec4a060811@o4508220361342976.ingest.de.sentry.io/4508220380282960',
			integrations: [
				Sentry.feedbackIntegration({
					// Additional SDK configuration goes in here, for example:
					colorScheme: 'auto'
				})
			]
		});
	}
	const breadcrumbs = $state(breadcrumbsConstructor(page.data.t));

	const pageTitle = $derived.by(() => {
		try {
			return renderBreadcrumb(
				breadcrumbs[page.route.id || '/(app)/'][
					breadcrumbs[page.route.id || '/(app)/'].length - 1
				].title(),
				page.data.pageTitle
			);
		} catch (err) {
			return page.data.t.pages.home.index();
		}
	});
	const { children } = $props();

	import { getFlash } from 'sveltekit-flash-message';
	//TODO: Replace with svelte-french-toast when it supports svelte 5
	import toast, { Toaster } from 'svelte-hot-french-toast';
	import type { SupportedLanguage } from '$lib/i18n';
	let locale: SupportedLanguage = $state(getLocale());
	const flash = getFlash(page);
	flash.subscribe(($flash) => {
		if (!$flash) return;
		if ($flash.type === 'success') {
			toast.success($flash.message);
		}
		if ($flash.type === 'error') {
			toast.error($flash.message);
		}
		flash.set(undefined);
	});
	import ParaglideClientSide from '$lib/i18n/ParaglideClientSide.svelte';
	if (browser) {
		if ('umami' in window) {
			//@ts-expect-error
			window.umami.identify({ team: page.data.instance.slug, id: page.data.admin.id });
		}
	}
</script>

<svelte:head>
	<script
		defer
		src="https://cloud.umami.is/script.js"
		data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
		data-tag={page.data.instance.slug}
	></script>
	{#key page.url.pathname}
		<title>{pageTitle} - Belcoda</title>
	{/key}
</svelte:head>
<ParaglideClientSide bind:locale />
<!-- Forces the layout to rerender when language is changed -->
{#key locale}
	<!-- Also required for the old localization library -->
	{#key page.data.language}
		<Toaster />
		<div class="min-h-screen bg-slate-50">
			<MainNav />
			<div class="container mx-auto px-4 grid grid-cols-12 gap-4">
				<div class="hidden lg:block lg:col-span-3 xl:col-span-2">
					{#key page.url.pathname}<Sidebar />{/key}
				</div>
				<div class="col-span-12 lg:col-span-9 xl:col-span-10 mb-24 lg:mb-0">
					{#key page.url.pathname}<Breadcrumb />{/key}
					{@render children()}
				</div>
			</div>
			<div class="block lg:hidden">
				{#key page.url.pathname}<BottomNav />{/key}
			</div>
			<footer class="hidden lg:block">
				<Footer />
			</footer>
		</div>
	{/key}
{/key}
