<script lang="ts">
	import { page } from '$app/stores';
	import {
		superForm,
		Input,
		valibotClient,
		Debug,
		Slug,
		Button,
		Error,
		Grid,
		HTML
	} from '$lib/comps/ui/forms';
	import * as m from '$lib/paraglide/messages';
	import UploadWidget from '$lib/comps/widgets/uploads/UploadWidget.svelte';
	import { create, update } from '$lib/schema/website/content';
	const { isCreate, contentTypeSlug = 'pages' }: { isCreate: boolean; contentTypeSlug: string } =
		$props();
	const form = superForm($page.data.form, {
		validators: valibotClient(isCreate ? create : update),
		dataType: 'json'
	});
	const { form: formData, message, enhance } = form;
	import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';
	import { slugify } from '$lib/utils/text/string';
	import { dev } from '$app/environment';
	const pageUrl = $derived(
		`http${dev ? '' : 's'}://${$page.data.instance.slug}.${PUBLIC_ROOT_DOMAIN}/${contentTypeSlug}/${slugify($formData.slug || $formData.heading)}`
	);
	import Link from 'lucide-svelte/icons/link';
	let editSlug = $state(false);
</script>

<form method="post" use:enhance>
	<Grid cols={1}>
		<Error error={$message} />
		<Input
			{form}
			name="heading"
			label={m.major_vivid_reindeer_kick()}
			bind:value={$formData.heading}
		/>
		{@render slug()}
		<HTML {form} name="html" label={m.whole_sweet_slug_attend()} bind:value={$formData.html} />
		<UploadWidget
			label={m.funny_away_spider_trust()}
			upload_id={$formData.feature_image_upload_id}
			onselected={(upload) => {
				if (upload?.id) $formData.feature_image_upload_id = upload.id;
				if (upload === null) $formData.feature_image_upload_id = null;
			}}
		/>
		<Button></Button>
		<Debug data={$formData} />
	</Grid>
</form>

{#snippet slug()}
	{#if $formData.heading.length > 0 && !editSlug}
		<div class="flex justify-end items-center gap-2">
			<Link size={18} class="text-muted-foreground" />
			<div class="text-sm text-muted-foreground">
				{m.weary_inclusive_whale_dial()}
			</div>
			<button
				onclick={() => {
					$formData.slug = slugify($formData.slug || $formData.heading);
					editSlug = true;
				}}
				class="cursor-pointer"
			>
				<code class="text-sm text-primary-500 underline">{pageUrl}</code>
			</button>
		</div>
	{/if}
	{#if editSlug}
		<div class="flex justify-end items-center gap-2">
			<Link size={18} class="text-muted-foreground" />
			<code class="text-sm text-primary-500 underline">
				{`http${dev ? '' : 's'}://${$page.data.instance.slug}.${PUBLIC_ROOT_DOMAIN}/${contentTypeSlug}/`}
			</code>
			<Slug
				{form}
				name="slug"
				label={null}
				description={null}
				bind:value={$formData.slug as string}
			/>
			<Button onclick={() => (editSlug = false)} size="sm" variant="ghost"
				>{m.empty_warm_squirrel_chop()}</Button
			>
		</div>
	{/if}
{/snippet}
