<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import {
		Input,
		Button,
		Slug,
		DateTime,
		Error,
		HTML,
		Textarea,
		Grid,
		Switch,
		Debug,
		superForm,
		valibotClient
	} from '$lib/comps/ui/forms';
	const { isUpdate }: { isUpdate: boolean } = $props();

	import { create, update } from '$lib/schema/events/events';
	const form = superForm($page.data.form, {
		validators: valibotClient(isUpdate ? update : create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	import UploadWidget from '$lib/comps/widgets/uploads/UploadWidget.svelte';
	import { PUBLIC_ROOT_DOMAIN } from '$env/static/public';
	import { slugify } from '$lib/utils/text/string';
	import { dev } from '$app/environment';
	const pageUrl = $derived(
		`http${dev ? '' : 's'}://${$page.data.instance.slug}.${PUBLIC_ROOT_DOMAIN}/events/${slugify($formData.slug || $formData.heading)}`
	);
	import Link from 'lucide-svelte/icons/link';
	import Alert from '$lib/comps/ui/alert/alert.svelte';
	let editSlug = $state(false);
</script>

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />

		<Input
			{form}
			name="heading"
			label={m.lofty_suave_bumblebee_bake()}
			bind:value={$formData.heading}
		/>
		{@render slug()}
		<HTML
			{form}
			name="html"
			label={'Event details'}
			description={m.trick_less_stingray_enrich()}
			bind:value={$formData.html}
		/>

		{@render dateTime()}
		{@render location()}

		<UploadWidget
			label={m.sharp_sea_anteater_walk()}
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

{#snippet dateTime()}
	<Grid cols={2}>
		{#if $formData.starts_at > $formData.ends_at}
			<Alert class="col-span-2" variant="destructive">{m.basic_basic_ape_fall()}</Alert>
		{/if}
		<DateTime
			{form}
			name="starts_at"
			label="Starts at"
			minuteSteps={1}
			bind:value={$formData.starts_at}
		/>
		<DateTime
			{form}
			name="ends_at"
			label="Ends at"
			minuteSteps={1}
			bind:value={$formData.ends_at}
		/>
	</Grid>
{/snippet}

{#snippet location()}
	<Grid cols={1} class="border p-4 rounded">
		<Switch
			class="border-none p-0"
			{form}
			name="online"
			label={m.low_polite_worm_amaze()}
			description={m.mealy_next_manatee_favor()}
			bind:checked={$formData.online}
		/>
		<Separator />
		{#if $formData.online}
			<Input
				{form}
				name="online_url"
				label={m.nice_dull_mammoth_snip()}
				bind:value={$formData.online_url as string}
			/>
			<Textarea
				{form}
				name="online_instructions"
				label={m.light_green_warthog_climb()}
				bind:value={$formData.online_instructions as string}
			/>
		{:else}
			<Input
				{form}
				name="address_line_1"
				label={m.stout_salty_pelican_endure()}
				bind:value={$formData.address_line_1 as string}
			/>
			<Input
				{form}
				name="address_line_2"
				label={m.proof_broad_herring_persist()}
				bind:value={$formData.address_line_2 as string}
			/>
			<Grid cols={3}>
				<Input
					{form}
					name="locality"
					label={m.slimy_patient_seal_explore()}
					bind:value={$formData.locality as string}
				/>
				<Input
					{form}
					name="state"
					label={m.dark_late_turtle_snap()}
					bind:value={$formData.state as string}
				/>
				<Input
					{form}
					name="postcode"
					label={m.swift_white_hornet_dig()}
					bind:value={$formData.postcode as string}
				/>
			</Grid>
		{/if}
	</Grid>
{/snippet}

{#snippet slug()}
	{#if $formData.heading.length > 0 && !editSlug}
		<div class="flex justify-end items-center gap-2">
			<Link size={18} class="text-muted-foreground" />
			<div class="text-sm text-muted-foreground">
				{m.good_dizzy_chicken_spark()}
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
				>{m.empty_warm_squirrel_chop()}</Button
			>
		</div>
	{/if}
{/snippet}
