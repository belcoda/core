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
				successMessage: page.data.t.forms.actions.success(),
				errorMessage: page.data.t.forms.actions.failed(),
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
				message: page.data.t.forms.actions.failed()
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
			label={page.data.t.forms.fields.generic.name.label()}
			bind:value={$nameValue as string}
		/>
	{/if}

	<Input
		{disabled}
		{form}
		name={subject}
		label={page.data.t.forms.fields.email.subject.label()}
		bind:value={$subjectValue as string}
	/>

	{#if !$useHtmlAsTextValue}
		<div class="flex justify-end items-center gap-2">
			<Label class="text-muted-foreground"
				>{editHTML
					? page.data.t.forms.fields.generic.html.label()
					: page.data.t.forms.fields.generic.plain_text.label()}</Label
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
		<h4 class="text-sm font-semibold">{page.data.t.forms.buttons.advanced_settings()}</h4>
		<Collapsible.Trigger class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}>
			<ChevronsUpDown />
			<span class="sr-only">{page.data.t.forms.buttons.toggle()}</span>
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content class="space-y-2">
		<Alert.Root>
			<TriangleAlert class="size-4" />
			<Alert.Title>{page.data.t.common.alerts.heads_up()}</Alert.Title>
			<Alert.Description class="text-muted-foreground mt-2">
				{page.data.t.forms.fields.email.advanced_settings.warning()}
			</Alert.Description>
		</Alert.Root>
		<Grid cols={1}>
			<Input
				{disabled}
				{form}
				name={from}
				label={page.data.t.forms.fields.email.from.label()}
				description={page.data.t.forms.fields.email.from.description()}
				bind:value={$fromValue as string}
			/>

			<Input
				{disabled}
				{form}
				name={replyTo}
				label={page.data.t.forms.fields.email.reply_to.label()}
				description={page.data.t.forms.fields.email.reply_to.description()}
				bind:value={$replyToValue as string}
			/>

			<Textarea
				{disabled}
				{form}
				name={previewText}
				label={page.data.t.forms.fields.email.preview_text.label()}
				description={page.data.t.forms.fields.email.preview_text.description()}
				bind:value={$previewTextValue as string}
			/>

			{@render templateSelector()}

			<Checkbox
				{form}
				name={useHtmlAsText}
				label={page.data.t.forms.fields.email.useHtmlAsPlainText.label()}
				description={page.data.t.forms.fields.email.useHtmlAsPlainText.description()}
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
			<Card.Title>{page.data.t.forms.fields.email.send_test_email.label()}</Card.Title>
		</Card.Header>
		{#if loading}
			<div class="my-12"><Loading /></div>
		{:else}
			<Card.Content>
				<InputWidget bind:value={testEmail} />
			</Card.Content>
			<Card.Footer>
				<Button type="button" onclick={() => triggerTestSend()}
					>{page.data.t.forms.buttons.send()}</Button
				>
			</Card.Footer>
		{/if}
	</Card.Root>
{/if}

{#snippet templateSelector()}
	{#if templates.length > 0}
		<div class="w-full mb-2">
			<Label>{page.data.t.forms.fields.email.template.label()}</Label>
			<Select.Root
				type="single"
				onValueChange={(val) => {
					const id = Number(val);
					$templateIdValue = id;
				}}
			>
				<Select.Trigger class="w-full">
					{templates.find((t) => t.id === $templateIdValue)?.name ||
						page.data.t.forms.fields.email.template.label()}
				</Select.Trigger>
				<Select.Content>
					{#each templates as template}
						<Select.Item value={template.id.toString()}>{template.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<div class="text-muted-foreground text-sm mt-1.5">
				{page.data.t.forms.fields.email.template.description()}
			</div>
		</div>
	{/if}
{/snippet}
