<script lang="ts">
	const { data } = $props();
	import { update } from '$lib/schema/communications/email/messages';
	import * as m from '$lib/paraglide/messages';
	import {
		Debug,
		Button,
		superForm,
		Grid,
		valibotClient,
		Error as FormError
	} from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import EditMessageForm from '$lib/comps/forms/EditEmailMessageForm.svelte';
	const form = superForm(data.form, {
		validators: valibotClient(update)
	});
	const { form: formData, enhance, message } = form;
	const disabled = data.send.started_at !== null;
	import H1 from '$lib/comps/typography/H1.svelte';
	import Check from 'lucide-svelte/icons/check';
	import Badge from '$lib/comps/ui/badge/badge.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { goto, invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';

	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	const flash = getFlash(page);

	let loading: boolean = $state(false);

	if (data.send.started_at && !data.send.completed_at && browser) {
		setTimeout(() => {
			invalidateAll();
		}, 10000);
	}

	async function deleteMessage() {
		if (!window.confirm(m.moving_acidic_crow_imagine())) {
			return;
		}

		try {
			loading = true;
			const response = await fetch(`/api/v1/communications/email/messages/${data.message.id}`, {
				method: 'DELETE'
			});
			if (!response.ok) {
				throw new Error(m.keen_agent_shell_mop());
			}
			loading = false;
			$flash = { type: 'success', message: m.dizzy_actual_elephant_evoke() };
			goto(`/communications/email`);
		} catch (error) {
			if (error instanceof Error) {
				$flash = { type: 'error', message: error.message };
			} else {
				$flash = { type: 'error', message: 'An error occurred' };
			}
		} finally {
			loading = false;
		}
	}
</script>

<PageHeader title={data.send.name}>
	{#snippet headerSnippet()}
		<div class="flex items-center gap-4">
			<H1>{data.send.name}</H1>
			{#if data.send.started_at && data.send.completed_at}
				<Badge class="flex items-center gap-2" variant="success" size="lg">
					<Check size={16} />
					{m.candid_grand_platypus_praise()}
				</Badge>
			{:else if data.send.started_at}
				<Badge variant="warning" class="flex items-center gap-2" size="lg">
					<LoaderCircle class="animated animate-spin" size={16} />
					{m.gaudy_gray_gadfly_reap()}
				</Badge>
			{/if}
		</div>
		{#if data.send.completed_at}<div class="mt-2 text-muted-foreground text-lg">
				{m.grassy_odd_elephant_evoke({
					localizedTimeAgo: data.timeAgo.format(data.send.completed_at)
				})}
			</div>{/if}
	{/snippet}
	{#snippet button()}
		<div class="flex items-center gap-2">
			{#if !data.send.started_at}
				<Button href="/communications/email/{data.send.id}/send" variant="outline" size="sm">
					{m.factual_nimble_snail_tend()}
				</Button>
			{/if}
			{#if !disabled}
				<Button href="/communications/email/{data.send.id}/edit" variant="default" size="sm">
					{m.alert_bright_panda_care()}
				</Button>
			{/if}
		</div>
	{/snippet}
</PageHeader>

<form use:enhance method="post" action="?message_id={data.message.id}">
	<Grid cols={1} class="mt-6">
		<FormError error={$message} />
		<EditMessageForm
			{form}
			{disabled}
			templateId="template_id"
			templates={data.templates.items}
			messageId={data.message.id}
			name="name"
			previewText="preview_text"
			from="from"
			replyTo="reply_to"
			useHtmlAsText="use_html_for_plaintext"
			subject="subject"
			html="html"
			text="text"
		/>
		<div class="flex gap-2 justify-end">
			<Button {disabled} type="submit">{m.empty_warm_squirrel_chop()}</Button>
			<Button
				type="button"
				variant="destructive"
				onclick={() => {
					deleteMessage();
				}}
			>
				{m.wide_major_pig_swim()}
			</Button>
		</div>

		<Debug data={formData} />
	</Grid>
</form>
