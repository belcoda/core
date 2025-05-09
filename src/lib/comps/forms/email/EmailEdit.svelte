<script lang="ts">
	import { page } from '$app/state';
	import { Input, Button, Debug, Error, Grid, HTML, Textarea, Select } from '$lib/comps/ui/forms';
	import * as m from '$lib/paraglide/messages';
	import {
		update as updateMessage,
		create as createMessage,
		type Update as UpdateMessage,
		type CreateInput as CreateMessage
	} from '$lib/schema/communications/email/messages';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { getFlash } from 'sveltekit-flash-message';

	const flash = getFlash(page);

	let {
		mode,
		actionUrl,
		messageId,
		disabled = false,
		formObject
	}: {
		mode: 'create' | 'update';
		actionUrl: string;
		messageId?: number;
		disabled?: boolean;
		formObject: SuperValidated<UpdateMessage | CreateMessage>;
	} = $props();

	const form = superForm(formObject, {
		validators: valibotClient(mode === 'create' ? createMessage : updateMessage),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;

	import * as Alert from '$lib/comps/ui/alert/index.js';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Collapsible from '$lib/comps/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/comps/ui/button/index.js';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import SendTestEmail from '$lib/comps/forms/email/SendTestEmail.svelte';
	import { goto } from '$app/navigation';

	async function deleteMessage() {
		if (!window.confirm(m.moving_acidic_crow_imagine())) {
			return;
		}
		try {
			const response = await fetch(`/api/v1/communications/email/messages/${messageId}`, {
				method: 'DELETE'
			});
			if (!response.ok) {
				throw new Error(m.keen_agent_shell_mop());
			}
			$flash = { type: 'success', message: m.dizzy_actual_elephant_evoke() };
			goto(`/communications/email`);
		} catch (error) {
			if (error instanceof Error) {
				$flash = { type: 'error', message: error.message };
			} else {
				$flash = { type: 'error', message: 'An error occurred' };
			}
		}
	}
</script>

<Grid cols={1}>
	{#if disabled}
		<Alert.Root>
			<TriangleAlert class="size-4" />
			<Alert.Title>Message has been sent</Alert.Title>
			<Alert.Description class="text-muted-foreground mt-2"
				>This message cannot be edited or deleted as it has already been sent. If you would like to
				edit or send a new messsage, you can create a copy of this message.
				<form
					class="flex justify-center mt-2"
					action={`/communications/email/messages/${messageId}?/duplicate`}
					method="POST"
				>
					<Button variant="outline">Clone</Button>
				</form>
			</Alert.Description>
		</Alert.Root>
	{/if}
	<form method="POST" action={actionUrl} use:enhance>
		<Error error={$message} />
		<input type="hidden" name="point_person_id" value={page.data.admin.id} />
		<Input
			{disabled}
			{form}
			name="name"
			label={m.extra_wild_earthworm_commend()}
			description={'A descriptive name for the email message. This will not be shown to the recipient.'}
			bind:value={$formData.name as string}
		/>
		<Input
			{form}
			{disabled}
			name="subject"
			label={m.direct_mean_jurgen_buzz()}
			description={m.patchy_sleek_lemur_enjoy()}
			bind:value={$formData.subject as string}
		/>
		<HTML
			{form}
			{disabled}
			name={'html'}
			label={null}
			description={null}
			bind:value={$formData.html as string}
		/>
		{#if messageId && !disabled}{@render sendTestEmail(messageId)}{/if}
		{@render advancedSettings()}
		<div class="flex items-center justify-end gap-2">
			<Button {disabled} type="submit">{m.empty_warm_squirrel_chop()}</Button>
			<Button type="button" variant="destructive" onclick={deleteMessage}
				>{m.wide_major_pig_swim()}</Button
			>
		</div>
		<Debug data={$formData} />
	</form>
</Grid>

{#snippet sendTestEmail(messageId: number)}
	<Separator class="my-6" />
	<SendTestEmail message={$formData} {messageId} />
{/snippet}

{#snippet advancedSettings()}
	<!-- Advanced settings -->
	<Collapsible.Root class="w-full space-y-2">
		<div class="flex items-center justify-between space-x-4">
			<h4 class="text-sm font-semibold">{m.extra_any_florian_cry()}</h4>
			<Collapsible.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
			>
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
					{form}
					{disabled}
					name={'from'}
					label={m.dry_smart_pigeon_propel()}
					description={m.tense_basic_grizzly_walk()}
					bind:value={$formData.from as string}
				/>

				<Input
					{form}
					{disabled}
					name={'reply_to'}
					label={m.major_suave_stork_renew()}
					description={m.basic_teal_termite_lend()}
					bind:value={$formData.reply_to as string}
				/>

				<Textarea
					{form}
					{disabled}
					name={'preview_text'}
					label={m.honest_sour_giraffe_seek()}
					description={m.weird_whole_mallard_play()}
					bind:value={$formData.preview_text as string}
				/>

				<Select
					{form}
					{disabled}
					name={'template_name'}
					label={m.quick_sunny_giraffe_laugh()}
					description={m.helpful_tidy_jellyfish_enrich()}
					bind:value={$formData.template_name as string}
					options={[
						{
							value: 'main-nologo',
							label: m.quick_inclusive_finch_dash()
						},
						{
							value: 'minimal',
							label: m.trite_trite_hornet_arrive()
						},
						{
							value: 'main',
							label: m.vivid_bold_tiger_laugh()
						}
					]}
				/>

				<!-- {@render templateSelector()} -->
			</Grid>
		</Collapsible.Content>
	</Collapsible.Root>
{/snippet}
