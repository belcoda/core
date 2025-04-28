<script lang="ts">
	import MainNav from '$lib/comps/nav/menu-bar.svelte';
	import BottomNav from '$lib/comps/nav/mobile/bottom-nav.svelte';
	import Sidebar from '$lib/comps/nav/desktop/sidebar.svelte';
	import Breadcrumb from '$lib/comps/nav/breadcrumbs/breadcrumbs.svelte';
	import Footer from '$lib/comps/nav/footer/footer.svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import {
		breadcrumbs as breadcrumbsConstructor,
		renderBreadcrumb
	} from '$lib/comps/nav/breadcrumbs/breadcrumbs';
	import { getLocale } from '$lib/paraglide/runtime';
	import Button from '$lib/comps/ui/button/button.svelte';
	import { PUBLIC_UMAMI_WEBSITE_ID } from '$env/static/public';
	import { PUBLIC_SENTRY_DSN } from '$env/static/public';
	import * as Sentry from '@sentry/sveltekit';
	import { browser, dev } from '$app/environment';
	import { onMount } from 'svelte';
	onMount(() => {
		if (browser && !dev) {
			Sentry.init({
				dsn: PUBLIC_SENTRY_DSN,
				integrations: [
					Sentry.feedbackIntegration({
						colorScheme: 'auto',
						autoInject: false //stops Sentry from automatically rendering the button in bottom right corner
					})
				]
			});
			const feedback = Sentry.getFeedback(); //gets the feedback instance
			feedback?.attachTo(document.querySelector('#sentry-widget') as HTMLElement, {
				formTitle: 'Report a Bug or give feedback'
			});
		}
	});

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
			return m.smart_super_peacock_explore();
		}
	});
	const { children } = $props();

	import { getFlash } from 'sveltekit-flash-message';
	//TODO: Replace with svelte-french-toast when it supports svelte 5
	import toast, { Toaster } from 'svelte-hot-french-toast';
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

<!-- Required for the old localization library -- TODO: Remove when confirmed you can -->
{#key page.data.language}
	<Toaster />
	<div class="min-h-screen bg-slate-50">
		<MainNav />
		<div class="container mx-auto px-4 grid grid-cols-12 gap-4">
			<div class="hidden lg:block lg:col-span-3 xl:col-span-2">
				{#key page.url.pathname}<Sidebar />{/key}
			</div>
			<div class="col-span-12 lg:col-span-9 xl:col-span-10 lg:mb-0">
				{#key page.url.pathname}<Breadcrumb />{/key}
				{@render children()}
			</div>
		</div>
		<div class="block lg:hidden">
			{#key page.url.pathname}<BottomNav />{/key}
		</div>
		<footer class="block lg:mb-0">
			<Footer />
		</footer>
		<div class="w-full flex justify-center mb-20 lg:mb-12">
			<Button variant="ghost" size="sm" id="sentry-widget" class="text-muted-foreground text-xs"
				>Report a bug</Button
			>
		</div>
	</div>
{/key}
