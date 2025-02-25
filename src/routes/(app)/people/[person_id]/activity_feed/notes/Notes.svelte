<script lang="ts">
	import ActivityItem from '../ActivityItem.svelte';
	import { type List } from '$lib/schema/people/interactions';
	import { type Read as ReadPerson } from '$lib/schema/people/people';
	import * as actions from './actions';
	import Button from '$lib/comps/ui/button/button.svelte';
	import TextArea from '$lib/comps/ui/textarea/textarea.svelte';
	import { page } from '$app/stores';
	import EditHistory from './EditHistory.svelte';
	let showEditHistory: boolean = $state(false);
	type Props = {
		interaction: List['items'][number];
		person: ReadPerson;
		activityMessage?: string;
		children?: any;
	};
	let { interaction, person }: Props = $props();
	let edit: boolean = $state(false);
	let updatedNotes: string = $state(
		'notes' in interaction.details ? interaction.details.notes : ''
	);
	import { addLineBreaks, sanitizeHTML } from '$lib/utils/text/string';
</script>

{#if interaction.details.type === 'notes'}
	<ActivityItem
		{interaction}
		{person}
		activityMessage={$page.data.t.people.interactions.interactionMessage.notes(
			interaction.admin.full_name
		)}
		class="bg-yellow-100"
	>
		{#if edit}
			<div class="mt-2">
				<TextArea bind:value={updatedNotes} />
				<div class="flex justify-end mt-2">
					<Button
						onclick={async () => {
							const newInteraction = await actions.updateNotes({
								interactionId: interaction.id,
								personId: person.id,
								updatedNotes
							});
							interaction = newInteraction;
							edit = false;
						}}>{$page.data.t.forms.buttons.save()}</Button
					>
				</div>
			</div>
		{:else}
			<div class="mt-2 text-sm text-muted-foreground bg-yellow-100">
				{@html sanitizeHTML(addLineBreaks(interaction.details.notes))}
			</div>
			{#if interaction.details.edit_history.length > 0}
				<div class="text-right">
					<Button variant="ghost" size="xs" onclick={() => (showEditHistory = !showEditHistory)}>
						Last edited: {$page.data.timeAgo.format(
							interaction.details.edit_history[interaction.details.edit_history.length - 1]
								.edited_at
						)}
					</Button>
				</div>
				{#if showEditHistory}
					<EditHistory interaction={interaction.details} />
				{/if}
			{/if}
		{/if}
		{#snippet button()}
			<div>
				<Button variant="outline" size="xs" onclick={() => (edit = !edit)}
					>{$page.data.t.forms.buttons.edit()}</Button
				>
			</div>
		{/snippet}
	</ActivityItem>
{/if}
