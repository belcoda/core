<script lang="ts">
	import { page } from '$app/stores';
	import { type Read as ReadPerson } from '$lib/schema/people/people';
	import { type List as ListInteractions } from '$lib/schema/people/interactions';
	import ActivityItem from './ActivityItem.svelte';
	import SystemMessage from './SystemMessage.svelte';
	import Notes from './notes/Notes.svelte';
	import RenderInboundWhatsapp from '$lib/comps/widgets/interactions/RenderInboundWhatsapp.svelte';
	import RenderOutboundWhatsapp from '$lib/comps/widgets/interactions/RenderOutboundWhatsapp.svelte';
	import Pagination from '$lib/comps/ui/custom/pagination/pagination.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import LogActivity from '../LogActivity.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	let {
		interactions = $bindable({ items: [], count: 0 }),
		person
	}: { interactions: ListInteractions; person: ReadPerson; last?: boolean } = $props();
	import { parse } from '$lib/schema/valibot';
	import { list as listParseSchema } from '$lib/schema/people/interactions';
	let loading = $state(false);

	import { onMount, onDestroy } from 'svelte';

	let timer: null | ReturnType<typeof setInterval> = $state(null);
	async function fetchLatestInteractions() {
		const result = await fetch(`/api/v1/people/${person.id}/interactions`);
		if (result.ok) {
			const body = await result.json();
			const parsed = parse(listParseSchema, body);
			interactions = parsed;
		}
	}

	onMount(() => {
		timer = setInterval(async () => await fetchLatestInteractions(), 30000);
	});
	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	async function handleAddInteraction(interaction: (typeof interactions.items)[0] | undefined) {
		if (interaction) {
			const parsed = parse(listParseSchema.entries.items.item, interaction);
			interactions.items = [parsed, ...interactions.items];
		}
		setTimeout(async () => {
			await fetchLatestInteractions();
			document.querySelector('#bottom')?.scrollIntoView({ behavior: 'smooth' });
		}, 1000);
	}
</script>

<div><LogActivity personId={person.id} onLogged={handleAddInteraction} /></div>
<Separator class="my-6"></Separator>
<div class="relative w-full min-h-xl">
	{#if loading}
		<div class="bg-slate-50 bg-opacity-70 absolute inset-0 flex items-center justify-center z-50">
			<div class="animate-spin rounded-full text-muted-foreground">
				<LoaderCircle />
			</div>
		</div>
	{/if}
	<div class="grid grid-cols-1 gap-4">
		{#each interactions.items as interaction}
			{@render feed(interaction, person)}
		{:else}
			{@render noItems()}
		{/each}
	</div>
</div>
<Pagination bind:loading count={interactions.count} />

{#snippet feed(interaction: ListInteractions['items'][number], person: ReadPerson)}
	{#if interaction.details.type === 'person_added'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.added(interaction.details.details)}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'person_joined'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.joined(interaction.details.details)}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'user_details_updated'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.user_details_updated(
				interaction.details.method
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'notes'}
		<Notes
			{interaction}
			activityMessage={$page.data.t.people.interactions.interactionMessage.notes(
				interaction.admin.full_name
			)}
			{person}
			><div class="mt-2 text-sm text-muted-foreground">{interaction.details.notes}</div>
		</Notes>
	{/if}

	{#if interaction.details.type === 'phone_call_outbound'}
		<ActivityItem
			{interaction}
			activityMessage={$page.data.t.people.interactions.interactionMessage.phone_call_outbound(
				interaction.admin.full_name
			)}
			{person}
			><div class="mt-2 text-sm text-muted-foreground">
				{interaction.details.notes}
			</div></ActivityItem
		>
	{/if}

	{#if interaction.details.type === 'phone_call_inbound'}
		<ActivityItem
			{interaction}
			activityMessage={$page.data.t.people.interactions.interactionMessage.phone_call_inbound(
				interaction.admin.full_name
			)}
			{person}
			><div class="mt-2 text-sm text-muted-foreground">
				{interaction.details.notes}
			</div></ActivityItem
		>
	{/if}

	{#if interaction.details.type === 'email_outbound'}
		<ActivityItem
			{interaction}
			activityMessage={$page.data.t.people.interactions.interactionMessage.email_outbound(
				interaction.admin.full_name
			)}
			{person}
		>
			<div class="mt-2 text-sm text-muted-foreground">{interaction.details.message}</div>
		</ActivityItem>
	{/if}

	{#if interaction.details.type === 'email_inbound'}
		<ActivityItem
			{interaction}
			activityMessage={$page.data.t.people.interactions.interactionMessage.email_inbound(
				interaction.admin.full_name
			)}
			{person}
		>
			<div class="mt-2 text-sm text-muted-foreground">{interaction.details.message}</div>
		</ActivityItem>
	{/if}

	{#if interaction.details.type === 'outbound_whatsapp'}
		<RenderOutboundWhatsapp
			messageId={interaction.details.message_id}
			message={interaction.details.message}
			template={interaction.details.template}
			admin={interaction.admin}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'inbound_whatsapp'}
		<RenderInboundWhatsapp
			{person}
			timeAgo={interaction.created_at}
			messageId={interaction.details.message_id}
			message={interaction.details.message}
		/>
	{/if}

	{#if interaction.details.type === 'signed_petition'}
		{#if interaction.details.method === 'manual'}
			<ActivityItem
				{interaction}
				activityMessage={$page.data.t.people.interactions.interactionMessage.signed_petition.manual(
					interaction.admin.full_name,
					interaction.details.petition_name,
					`/petitions/${interaction.details.petition_id}`
				)}
				{person}
			/>
		{:else}
			<ActivityItem
				{interaction}
				activityMessage={$page.data.t.people.interactions.interactionMessage.signed_petition.self(
					person.full_name,
					interaction.details.petition_name,
					`/petitions/${interaction.details.petition_id}`
				)}
				{person}
			/>
		{/if}
	{/if}

	{#if interaction.details.type === 'registered_for_event'}
		{#if interaction.details.method === 'manual'}
			<ActivityItem
				{interaction}
				activityMessage={$page.data.t.people.interactions.interactionMessage.events.registered.manual(
					interaction.admin.full_name,
					interaction.details.event_name,
					`/events/${interaction.details.event_id}`
				)}
				{person}
			/>
		{:else}
			<ActivityItem
				{interaction}
				activityMessage={$page.data.t.people.interactions.interactionMessage.events.registered.self(
					person.full_name,
					interaction.details.event_name,
					`/events/${interaction.details.event_id}`
				)}
				{person}
			/>
		{/if}
	{/if}

	{#if interaction.details.type === 'cancelled_event_registration'}
		{#if interaction.details.method === 'manual'}
			<ActivityItem
				{interaction}
				activityMessage={$page.data.t.people.interactions.interactionMessage.events.cancelled.manual(
					interaction.admin.full_name,
					interaction.details.event_name,
					`/events/${interaction.details.event_id}`
				)}
				{person}
			/>
		{:else}
			<ActivityItem
				{interaction}
				activityMessage={$page.data.t.people.interactions.interactionMessage.events.cancelled.self(
					person.full_name,
					interaction.details.event_name,
					`/events/${interaction.details.event_id}`
				)}
				{person}
			/>
		{/if}
	{/if}

	{#if interaction.details.type === 'attended_event'}
		<ActivityItem
			{interaction}
			activityMessage={$page.data.t.people.interactions.interactionMessage.events.attended(
				interaction.admin.full_name,
				interaction.details.event_name,
				`/events/${interaction.details.event_id}`
			)}
			{person}
		/>
	{/if}

	{#if interaction.details.type === 'noshow_event'}
		<ActivityItem
			{interaction}
			activityMessage={$page.data.t.people.interactions.interactionMessage.events.noshow(
				interaction.admin.full_name,
				interaction.details.event_name,
				`/events/${interaction.details.event_id}`
			)}
			{person}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_followup_email'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.received_event_followup_email(
				interaction.details.event_id,
				interaction.details.event_name,
				interaction.details.message_id
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_reminder_email'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.received_event_reminder_email(
				interaction.details.event_id,
				interaction.details.event_name,
				interaction.details.message_id
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_cancellation_email'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.received_event_cancellation_email(
				interaction.details.event_id,
				interaction.details.event_name,
				interaction.details.message_id
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'received_event_registration_email'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.received_event_registration_email(
				interaction.details.event_id,
				interaction.details.event_name,
				interaction.details.message_id
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'received_petition_autoresponse_email'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.received_petition_autoresponse_email(
				interaction.details.petition_id,
				interaction.details.petition_name,
				interaction.details.message_id
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'whatsapp_verified'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.whatsapp_verified(
				interaction.details.phone_number
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'added_to_list'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.added_to_list(
				interaction.details.list_id,
				interaction.details.list_name
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'removed_from_list'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.removed_from_list(
				interaction.details.list_id,
				interaction.details.list_name
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'added_tag'}
		<SystemMessage
			message={`<div class="flex items-center gap-2"><div>${$page.data.t.people.interactions.html.added_tag()}</div><div class="font-bold">#${interaction.details.tag_name}</div></div>`}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'removed_tag'}
		<SystemMessage
			message={`<div class="flex items-center gap-2"><div>${$page.data.t.people.interactions.html.removed_tag()}</div><div class="font-bold">#${interaction.details.tag_name}</div></div>`}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'added_to_group'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.added_to_group(
				interaction.details.group_id,
				interaction.details.group_name
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'removed_from_group'}
		<SystemMessage
			message={$page.data.t.people.interactions.html.removed_from_group(
				interaction.details.group_id,
				interaction.details.group_name
			)}
			timeAgo={interaction.created_at}
		/>
	{/if}
{/snippet}

{#snippet noItems()}
	<div class="flex items-center justify-center h-48">
		<div>
			<p class="text-muted-foreground text-center text-lg lg:text-xl">
				{$page.data.t.common.data.no_activity()}
			</p>
		</div>
	</div>
{/snippet}
