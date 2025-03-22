<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import * as m from '$lib/paraglide/messages';
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
			label={m.careful_major_sparrow_explore()}
			bind:value={$formData.heading}
		/>
		{@render slug()}
		<HTML
			{form}
			name="html"
			label={m.plain_wise_walrus_pout()}
			description={m.sour_few_seahorse_flop()}
			bind:value={$formData.html}
		/>
		<Separator class="my-6" />
		<UploadWidget
			label={m.still_zany_warbler_savor()}
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
			label={m.clear_minor_gecko_buy()}
			description={m.sour_game_javelina_emerge()}
			bind:value={$formData.petition_target}
		/>
		<Textarea
			{form}
			name="petition_text"
			label={m.awful_grand_wombat_imagine()}
			description={m.sunny_major_florian_bend()}
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
				{m.clean_salty_haddock_drop()}
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
				{`http${dev ? '' : 's'}://${$page.data.instance.slug}.${PUBLIC_ROOT_DOMAIN}/petitions/`}
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
