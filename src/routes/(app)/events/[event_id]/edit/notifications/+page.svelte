<script lang="ts">
	export let data;
	import { page } from '$app/stores';
	import { Switch, Debug, Error, Input, Grid, superForm, valibotClient } from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import MessagesDropdown from '$lib/comps/widgets/communications/email/MessagesDropdown.svelte';
	import { update } from '$lib/schema/events/events';
	const form = superForm(data.form, {
		validators: valibotClient(update),
		dataType: 'json'
	});
	let { form: formData, enhance, message, allErrors } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.yummy_frail_dove_pick()}>
	{#snippet button()}
		<div class="flex items-center gap-2">
			<Button href="/events/{$page.params.event_id}/edit">{m.super_broad_gopher_hurl()}</Button>
		</div>
	{/snippet}
</PageHeader>

{#snippet editPreviewButtons(messageId: number, visible: boolean)}
	{#if visible}
		<div class="flex items-center gap-2">
			<Button href="/communications/email/messages/{messageId}" target="_blank">
				{m.giant_misty_shrimp_stop()}
			</Button>
			<Button
				variant="outline"
				href="/preview/email/{messageId}?event_id={$page.params.event_id}"
				target="_blank"
			>
				{m.alive_silly_antelope_build()}
			</Button>
		</div>
	{/if}
{/snippet}

<form method="post" use:enhance>
	<Grid cols={1} class="mt-4">
		<Error error={$message} />
		<Grid cols={1} class="border rounded-lg p-4">
			<Switch
				class="border-none p-0"
				{form}
				name="send_registration_email"
				label={m.ideal_livid_bulldog_dart()}
				description={m.teary_salty_duck_mop()}
				bind:checked={$formData.send_registration_email as boolean}
			/>
		</Grid>
		<Grid cols={1} class="border rounded-lg p-4">
			<Switch
				class="border-none p-0"
				{form}
				name="send_reminder_email"
				label={m.main_plane_lemur_bless()}
				description={data.event.reminder_sent_at
					? m.stale_direct_sawfish_grip({
							renderedTimeAgo: data.timeAgo.format(data.event.reminder_sent_at)
						})
					: m.dull_less_lynx_heart()}
				disabled={data.event.reminder_sent_at !== null}
				bind:checked={$formData.send_reminder_email as boolean}
			/>

			<Input
				type="number"
				{form}
				name="send_reminder_hours_before_start"
				label={m.mellow_key_kudu_pinch()}
				bind:value={$formData.send_reminder_hours_before_start as number}
			/>
		</Grid>
		<Grid cols={1} class="border rounded-lg p-4">
			<Switch
				class="border-none p-0"
				{form}
				name="send_cancellation_email"
				label={m.cozy_ago_marmot_emerge()}
				description={m.careful_fresh_insect_boil()}
				bind:checked={$formData.send_cancellation_email as boolean}
			/>
		</Grid>
		<Grid cols={1} class="border rounded-lg p-4">
			<Switch
				class="border-none p-0"
				{form}
				name="send_followup_email"
				label={m.true_inner_jay_quell()}
				description={data.event.followup_sent_at
					? m.lost_noble_crow_transform({
							renderedTimeAgo: data.timeAgo.format(data.event.followup_sent_at)
						})
					: m.bright_lost_millipede_grasp()}
				disabled={data.event.followup_sent_at !== null}
				bind:checked={$formData.send_followup_email as boolean}
			/>

			<Input
				type="number"
				{form}
				name="send_followup_hours_after_end"
				label={m.deft_grassy_pug_hike()}
				bind:value={$formData.send_followup_hours_after_end as number}
			/>
			<MessagesDropdown
				bind:value={$formData.followup_email as number}
				onselect={(msg) => {
					$formData.followup_email = msg.id;
				}}
			/>
		</Grid>

		<div class="flex justify-end">
			<Button type="submit">{m.just_away_horse_urge()}</Button>
		</div>
		<Debug data={$formData} />
	</Grid>
</form>
