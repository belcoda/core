<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	import Loading from '$lib/comps/helpers/Loading.svelte';
	const flash = getFlash(page);
	import {
		formFieldProxy,
		type SuperForm,
		type FormPathLeaves,
		type FormFieldProxy
	} from 'sveltekit-superforms';
	import type { List as ListTemplates } from '$lib/schema/communications/email/templates';
	export let messageId: number;
	export let disabled: boolean = false;
	export let loading: boolean = false;
	export let form: SuperForm<T>;
	export let name: FormPathLeaves<T>;
	export let templateId: FormPathLeaves<T, number>;
	export let from: FormPathLeaves<T>;
	export let replyTo: FormPathLeaves<T>;
	export let subject: FormPathLeaves<T>;
	export let previewText: FormPathLeaves<T>;
	export let useHtmlAsText: FormPathLeaves<T, boolean>;
	export let html: FormPathLeaves<T>;
	export let text: FormPathLeaves<T>;

	export let hideName: boolean = true;
	export let templates: ListTemplates['items'] = [];
	export let allowTestEmail: boolean = true;
	const { value: fromValue } = formFieldProxy(form, from);
	const { value: replyToValue } = formFieldProxy(form, replyTo);
	const { value: subjectValue } = formFieldProxy(form, subject);
	const { value: nameValue } = formFieldProxy(form, name);
	const { value: templateIdValue } = formFieldProxy(
		form,
		templateId
	) satisfies FormFieldProxy<number>;
	const { value: useHtmlAsTextValue } = formFieldProxy(
		form,
		useHtmlAsText
	) satisfies FormFieldProxy<boolean>;
	const { value: htmlValue } = formFieldProxy(form, html);
	const { value: textValue } = formFieldProxy(form, text);
	const { value: previewTextValue } = formFieldProxy(form, previewText);

	import * as m from '$lib/paraglide/messages';

	import { Input, HTML, Checkbox, Button, Textarea, Grid, Switch } from '$lib/comps/ui/forms';
	import * as Select from '$lib/comps/ui/select';
	import * as Card from '$lib/comps/ui/card';
	import Label from '$lib/comps/ui/label/label.svelte';
	import SwitchWidget from '$lib/comps/ui/switch/switch.svelte';
	import * as Alert from '$lib/comps/ui/alert/index.js';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Collapsible from '$lib/comps/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/comps/ui/button/index.js';

	let editHTML = true;
	$: templatesForSelect = templates.map((template) => ({
		value: template.id,
		label: template.name
	}));
	//test email
	import InputWidget from '$lib/comps/ui/input/input.svelte';
	let testEmail: string | undefined;
	import { sendTestEmail } from '$lib/comps/forms/actions/sendTestEmail';
	import Separator from '$lib/comps/ui/separator/separator.svelte';

	async function triggerTestSend() {
		try {
			loading = true;
			const result = await sendTestEmail({
				email: testEmail,
				messageId,
				successMessage: m.mellow_jolly_cheetah_nurture(),
				errorMessage: m.pretty_stock_pigeon_amaze(),
				updateMessage: {
					name: $nameValue as string,
					from: $fromValue as string,
					reply_to: $replyToValue as string,
					preview_text: $previewTextValue as string,
					subject: $subjectValue as string,
					html: $htmlValue as string,
					text: $textValue as string,
					use_html_for_plaintext: $useHtmlAsTextValue as boolean,
					template_id: $templateIdValue as number
				},
				message: {
					id: messageId,
					name: $nameValue as string,
					from: $fromValue as string,
					reply_to: $replyToValue as string,
					preview_text: $previewTextValue as string,
					subject: $subjectValue as string,
					html: $htmlValue as string,
					text: $textValue as string,
					use_html_for_plaintext: $useHtmlAsTextValue as boolean,
					template_id: $templateIdValue as number,
					point_person_id: page.data.admin.id,
					created_at: new Date(),
					updated_at: new Date()
				},
				context: {}
			});
			$flash = result;
		} catch (err) {
			console.log(err);
			$flash = {
				type: 'error',
				message: m.fair_maroon_dragonfly_imagine()
			};
		} finally {
			loading = false;
		}
	}
</script>

<Grid cols={1} class="mt-6">
	{#if !hideName}
		<Input
			{disabled}
			{form}
			{name}
			label={m.extra_wild_earthworm_commend()}
			bind:value={$nameValue as string}
		/>
	{/if}

	<Input
		{disabled}
		{form}
		name={subject}
		label={m.direct_mean_jurgen_buzz()}
		bind:value={$subjectValue as string}
	/>

	{#if !$useHtmlAsTextValue}
		<div class="flex justify-end items-center gap-2">
			<Label class="text-muted-foreground"
				>{editHTML ? m.whole_sweet_slug_attend() : m.green_broad_porpoise_advise()}</Label
			>
			<SwitchWidget disabled={$useHtmlAsTextValue} bind:checked={editHTML} />
		</div>
	{/if}
	{#if editHTML}
		<div class="relative">
			{#if disabled}<div class="bg-white opacity-70 absolute z-20 inset-0"></div>{/if}
			<HTML {form} name={html} label={null} description={null} bind:value={$htmlValue as string} />
		</div>
	{:else}
		<Textarea
			{disabled}
			{form}
			name={text}
			rows={16}
			label={null}
			bind:value={$textValue as string}
		/>{/if}
</Grid>

<!-- Advanced settings -->
<Collapsible.Root class="w-full space-y-2">
	<div class="flex items-center justify-between space-x-4 px-4">
		<h4 class="text-sm font-semibold">{m.extra_any_florian_cry()}</h4>
		<Collapsible.Trigger class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}>
			<ChevronsUpDown />
			<span class="sr-only">{m.stout_away_grebe_pick()}</span>
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content class="space-y-2">
		<Alert.Root>
			<TriangleAlert class="size-4" />
			<Alert.Title>{m.heroic_quick_cod_lend()}</Alert.Title>
			<Alert.Description class="text-muted-foreground mt-2"
				>{m.fuzzy_many_puffin_propel()}
			</Alert.Description>
		</Alert.Root>
		<Grid cols={1}>
			<Input
				{disabled}
				{form}
				name={from}
				label={m.dry_smart_pigeon_propel()}
				description={m.tense_basic_grizzly_walk()}
				bind:value={$fromValue as string}
			/>

			<Input
				{disabled}
				{form}
				name={replyTo}
				label={m.major_suave_stork_renew()}
				description={m.basic_teal_termite_lend()}
				bind:value={$replyToValue as string}
			/>

			<Textarea
				{disabled}
				{form}
				name={previewText}
				label={m.honest_sour_giraffe_seek()}
				description={m.weird_whole_mallard_play()}
				bind:value={$previewTextValue as string}
			/>

			{@render templateSelector()}

			<Checkbox
				{form}
				name={useHtmlAsText}
				label={m.each_topical_hawk_hack()}
				description={m.suave_brief_jackdaw_aim()}
				bind:checked={$useHtmlAsTextValue as boolean}
			/>
		</Grid>
	</Collapsible.Content>
</Collapsible.Root>

<!-- Test email -->
{#if allowTestEmail && !disabled}
	<Separator class="my-6" />
	<Card.Root class="mb-6">
		<Card.Header>
			<Card.Title>{m.upper_giant_kitten_dart()}</Card.Title>
		</Card.Header>
		{#if loading}
			<div class="my-12"><Loading /></div>
		{:else}
			<Card.Content>
				<InputWidget bind:value={testEmail} />
			</Card.Content>
			<Card.Footer>
				<Button type="button" onclick={() => triggerTestSend()}
					>{m.level_tangy_grizzly_sway()}</Button
				>
			</Card.Footer>
		{/if}
	</Card.Root>
{/if}

{#snippet templateSelector()}
	{#if templates.length > 0}
		<div class="w-full mb-2">
			<Label>{m.known_ornate_parrot_clip()}</Label>
			<Select.Root
				type="single"
				onValueChange={(val) => {
					const id = Number(val);
					$templateIdValue = id;
				}}
			>
				<Select.Trigger class="w-full">
					{templates.find((t) => t.id === $templateIdValue)?.name || m.light_weary_niklas_aspire()}
				</Select.Trigger>
				<Select.Content>
					{#each templates as template}
						<Select.Item value={template.id.toString()}>{template.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<div class="text-muted-foreground text-sm mt-1.5">
				{m.watery_bad_mouse_breathe()}
			</div>
		</div>
	{/if}
{/snippet}
