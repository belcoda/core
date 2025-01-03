<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import {
		Input,
		Button,
		Error,
		Slug,
		HTML,
		Textarea,
		Grid,
		Debug,
		superForm,
		valibotClient
	} from '$lib/comps/ui/forms';
	import UploadWidget from '$lib/comps/widgets/uploads/UploadWidget.svelte';
	const { isUpdate = false }: { isUpdate: boolean } = $props();

	import { create, update } from '$lib/schema/petitions/petitions';
	const form = superForm($page.data.form, {
		validators: valibotClient(isUpdate ? update : create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;

	import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';
	import { slugify } from '$lib/utils/text/string';
	import { dev } from '$app/environment';
	const pageUrl = $derived(
		`http${dev ? '' : 's'}://${$page.data.instance.slug}.${PUBLIC_ROOT_DOMAIN}/petitions/${slugify($formData.slug || $formData.heading)}`
	);
	import Link from 'lucide-svelte/icons/link';
	let editSlug = $state(false);
</script>

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<Input
			{form}
			name="heading"
			label={$page.data.t.forms.fields.petitions.petition_title.label()}
			bind:value={$formData.heading}
		/>
		{@render slug()}
		<HTML
			{form}
			name="html"
			label={$page.data.t.forms.fields.petitions.petition_details.label()}
			description={$page.data.t.forms.fields.petitions.petition_details.description()}
			bind:value={$formData.html}
		/>
		<Separator class="my-6" />
		<UploadWidget
			label={$page.data.t.forms.fields.feature_image.label()}
			upload_id={$formData.feature_image_upload_id}
			onselected={(upload) => {
				if (upload?.id) $formData.feature_image_upload_id = upload.id;
				if (upload === null) $formData.feature_image_upload_id = null;
			}}
		/>
		<Separator class="my-6" />
		<Input
			{form}
			name="petition_target"
			label={$page.data.t.forms.fields.petitions.petition_target.label()}
			description={$page.data.t.forms.fields.petitions.petition_target.description()}
			bind:value={$formData.petition_target}
		/>
		<Textarea
			{form}
			name="petition_text"
			label={$page.data.t.forms.fields.petitions.petition_text.label()}
			description={$page.data.t.forms.fields.petitions.petition_text.description()}
			bind:value={$formData.petition_text}
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
				{$page.data.t.forms.fields.petitions.petition_page_link.label()}
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

			<code class="text-sm text-primary-500 underline"
				>{`http${dev ? '' : 's'}://${$page.data.instance.slug}.${PUBLIC_ROOT_DOMAIN}/events/`}</code
			>
			<Slug
				{form}
				name="slug"
				label={null}
				description={null}
				bind:value={$formData.slug as string}
			/>
			<Button onclick={() => (editSlug = false)} size="sm" variant="ghost"
				>{$page.data.t.forms.buttons.save()}</Button
			>
		</div>
	{/if}
{/snippet}
