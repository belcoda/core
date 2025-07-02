<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
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

	type PersonJoinedType =
		| {
				method: 'petition_signature';
				petition_id: number;
				petition_name: string;
		  }
		| {
				method: 'event_registration';
				event_id: number;
				event_name: string;
		  }
		| {
				method: 'other';
		  };

	type PersonAddedType =
		| {
				method: 'manual';
		  }
		| {
				method: 'import';
		  }
		| {
				method: 'petition_signature';
				petition_id: number;
				petition_name: string;
		  }
		| {
				method: 'event_registration';
				event_id: number;
				event_name: string;
		  }
		| {
				method: 'other';
		  };
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
	{#if interaction.details.type === 'person_added' && 'petition_id' in interaction.details.details && 'petition_name' in interaction.details.details}
		<SystemMessage
			message={m.minor_gaudy_wolf_reap({
				petition_id: interaction.details.details.petition_id,
				petition_name: interaction.details.details.petition_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'person_joined' && 'petition_id' in interaction.details.details && 'petition_name' in interaction.details.details}
		<SystemMessage
			message={m.home_fuzzy_tern_bake({
				petition_id: interaction.details.details.petition_id,
				petition_name: interaction.details.details.petition_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'user_details_updated'}
		{#if interaction.details.method === 'manual'}
			<SystemMessage message={m.heroic_zippy_quail_talk()} timeAgo={interaction.created_at} />
		{/if}
		{#if interaction.details.method === 'petition_signature'}
			<SystemMessage message={m.heroic_crazy_grebe_pat()} timeAgo={interaction.created_at} />
		{/if}
		{#if interaction.details.method === 'website_signup'}
			<SystemMessage message={m.left_mealy_elephant_jolt()} timeAgo={interaction.created_at} />
		{/if}
		{#if interaction.details.method === 'event_registration'}
			<SystemMessage message={m.white_day_pig_love()} timeAgo={interaction.created_at} />
		{/if}
	{/if}

	{#if interaction.details.type === 'notes'}
		<Notes
			{interaction}
			activityMessage={m.fuzzy_alert_crow_approve({ adminName: interaction.admin.full_name })}
			{person}
			><div class="mt-2 text-sm text-muted-foreground">{interaction.details.notes}</div>
		</Notes>
	{/if}

	{#if interaction.details.type === 'phone_call_outbound'}
		<ActivityItem
			{interaction}
			activityMessage={m.royal_large_weasel_cut({ adminName: interaction.admin.full_name })}
			{person}
			><div class="mt-2 text-sm text-muted-foreground">
				{interaction.details.notes}
			</div></ActivityItem
		>
	{/if}

	{#if interaction.details.type === 'phone_call_inbound'}
		<ActivityItem
			{interaction}
			activityMessage={m.cute_funny_pigeon_zoom({ adminName: interaction.admin.full_name })}
			{person}
			><div class="mt-2 text-sm text-muted-foreground">
				{interaction.details.notes}
			</div></ActivityItem
		>
	{/if}

	{#if interaction.details.type === 'email_outbound'}
		<ActivityItem
			{interaction}
			activityMessage={m.lazy_yummy_midge_beam({ adminName: interaction.admin.full_name })}
			{person}
		>
			<div class="mt-2 text-sm text-muted-foreground">{interaction.details.message}</div>
		</ActivityItem>
	{/if}

	{#if interaction.details.type === 'email_inbound'}
		<ActivityItem
			{interaction}
			activityMessage={m.ornate_dark_maggot_radiate({ adminName: interaction.admin.full_name })}
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
				activityMessage={m.icy_wild_badger_explore({
					adminName: interaction.admin.full_name,
					petitionUrl: `/petitions/${interaction.details.petition_id}`,
					petitionName: interaction.details.petition_name
				})}
				{person}
			/>
		{:else}
			<ActivityItem
				{interaction}
				activityMessage={m.brave_orange_boar_compose({
					personName: person.full_name,
					petitionName: interaction.details.petition_name,
					petitionUrl: `/petitions/${interaction.details.petition_id}`
				})}
				{person}
			/>
		{/if}
	{/if}

	{#if interaction.details.type === 'registered_for_event'}
		{#if interaction.details.method === 'manual'}
			<ActivityItem
				{interaction}
				activityMessage={m.brave_long_iguana_nurture({
					adminName: interaction.admin.full_name,
					eventName: interaction.details.event_name,
					eventUrl: `/events/${interaction.details.event_id}`
				})}
				{person}
			/>
		{:else}
			<ActivityItem
				{interaction}
				activityMessage={m.great_heavy_donkey_care({
					personName: person.full_name,
					eventName: interaction.details.event_name,
					eventUrl: `/events/${interaction.details.event_id}`
				})}
				{person}
			/>
		{/if}
	{/if}

	{#if interaction.details.type === 'cancelled_event_registration'}
		{#if interaction.details.method === 'manual'}
			<ActivityItem
				{interaction}
				activityMessage={m.ago_noisy_ray_inspire({
					adminName: interaction.admin.full_name,
					eventName: interaction.details.event_name,
					eventUrl: `/events/${interaction.details.event_id}`
				})}
				{person}
			/>
		{:else}
			<ActivityItem
				{interaction}
				activityMessage={m.stout_formal_jay_snap({
					personName: person.full_name,
					eventName: interaction.details.event_name,
					eventUrl: `/events/${interaction.details.event_id}`
				})}
				{person}
			/>
		{/if}
	{/if}

	{#if interaction.details.type === 'attended_event'}
		<ActivityItem
			{interaction}
			activityMessage={m.round_long_weasel_forgive({
				personName: person.full_name,
				eventName: interaction.details.event_name,
				eventUrl: `/events/${interaction.details.event_id}`
			})}
			{person}
		/>
	{/if}

	{#if interaction.details.type === 'noshow_event'}
		<ActivityItem
			{interaction}
			activityMessage={m.male_ornate_orangutan_roar({
				adminName: interaction.admin.full_name,
				eventName: interaction.details.event_name,
				eventUrl: `/events/${interaction.details.event_id}`
			})}
			{person}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_followup_email'}
		<SystemMessage
			message={m.weak_mad_shad_promise({
				eventId: interaction.details.event_id,
				eventName: interaction.details.event_name,
				messageId: interaction.details.message_id
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_reminder_email'}
		<SystemMessage
			message={m.east_blue_mallard_lift({
				eventId: interaction.details.event_id,
				eventName: interaction.details.event_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_registration_email'}
		<SystemMessage
			message={m.any_great_mouse_agree({
				eventId: interaction.details.event_id,
				eventName: interaction.details.event_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_cancellation_email'}
		<SystemMessage
			message={m.flat_mushy_boar_shine({
				eventId: interaction.details.event_id,
				eventName: interaction.details.event_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'received_event_reminder_email'}
		<SystemMessage
			message={m.mealy_crisp_turtle_loop({
				eventId: interaction.details.event_id,
				eventName: interaction.details.event_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'received_petition_autoresponse_email'}
		<SystemMessage
			message={m.proud_least_snail_walk({
				petitionId: interaction.details.petition_id,
				petitionName: interaction.details.petition_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'whatsapp_verified'}
		<SystemMessage
			message={m.giant_watery_camel_mix({ phoneNumber: interaction.details.phone_number })}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'added_to_list'}
		<SystemMessage
			message={m.dizzy_factual_vole_heal({
				listId: interaction.details.list_id,
				listName: interaction.details.list_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'removed_from_list'}
		<SystemMessage
			message={m.upper_flaky_pug_edit({
				listId: interaction.details.list_id,
				listName: interaction.details.list_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'added_tag'}
		<SystemMessage
			message={`<div class="flex items-center gap-2"><div>${m.quaint_shy_stingray_ask()}</div><div class="font-bold">#${interaction.details.tag_name}</div></div>`}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'removed_tag'}
		<SystemMessage
			message={`<div class="flex items-center gap-2"><div>${m.misty_top_moth_loop()}</div><div class="font-bold">#${interaction.details.tag_name}</div></div>`}
			timeAgo={interaction.created_at}
		/>
	{/if}

	{#if interaction.details.type === 'added_to_group'}
		<SystemMessage
			message={m.grand_formal_jackdaw_buy({
				groupId: interaction.details.group_id,
				groupName: interaction.details.group_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}
	{#if interaction.details.type === 'removed_from_group'}
		<SystemMessage
			message={m.every_away_lemming_kick({
				groupId: interaction.details.group_id,
				groupName: interaction.details.group_name
			})}
			timeAgo={interaction.created_at}
		/>
	{/if}
{/snippet}

{#snippet noItems()}
	<div class="flex items-center justify-center h-48">
		<div>
			<p class="text-muted-foreground text-center text-lg lg:text-xl">
				{m.ideal_heavy_cobra_cook()}
			</p>
		</div>
	</div>
{/snippet}
