<script lang="ts">
	const { data } = $props();
	import * as m from '$lib/paraglide/messages';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';
	import { renderAddress } from '$lib/utils/text/address';
	import { formatDateTimeRange, formatDate } from '$lib/utils/text/date';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';
	import Link from 'lucide-svelte/icons/link';
	import CopyButton from '$lib/comps/ui/copy-button/copy-button.svelte';
	import { PUBLIC_HOST } from '$env/static/public';

	const url = new URL(PUBLIC_HOST);
	const previewUrl = `${url.protocol}//${data.instance.slug}.${url.host}/events/${data.event.slug}`;
	import EditRegistrationForm from './EditRegistrationForm.svelte';
	import Tags from '$lib/comps/widgets/tags/Tags.svelte';
	import PointPerson from '$lib/comps/widgets/point_person/PointPerson.svelte';
	import Whatsapp from '$lib/comps/icons/whatsapp.svelte';
	import { renderRegistrationLink } from '$lib/utils/text/whatsapp';
	import { getFlash } from 'sveltekit-flash-message';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	const flash = getFlash(page);
	let copied = $state(false);
	const attendanceStatus: ['registered', 'attended', 'cancelled', 'noshow'] = [
		'registered',
		'attended',
		'cancelled',
		'noshow'
	];

	const attendanceStatusValues = {
		registered: m.curly_safe_kangaroo_launch(),
		attended: m.gaudy_brave_boar_spark(),
		cancelled: m.heroic_swift_skate_splash(),
		noshow: m.minor_major_antelope_feast()
	};

	const statusOptions = attendanceStatus.map((status) => ({
		value: status,
		label: attendanceStatusValues[status]
	}));

	const attendees = $state(data.attendees.items);
	const registrationLink = renderRegistrationLink(data.instance, data.event).url;

	function makeStatusOptions(status: (typeof attendanceStatus)[number]) {
		return {
			value: status,
			label: attendanceStatusValues[status]
		};
	}

	async function deleteEvent() {
		if (!confirm(m.moving_acidic_crow_imagine())) {
			return;
		}

		try {
			const response = await fetch(`/api/v1/events/${data.event.id}`, {
				method: 'DELETE'
			});
			if (!response.ok) {
				throw new Error(m.keen_agent_shell_mop());
			}
			$flash = { type: 'success', message: m.dizzy_actual_elephant_evoke() };
		} catch (error) {
			if (error instanceof Error) {
				$flash = { type: 'error', message: error.message };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
		goto(`/events`);
	}
</script>

<PageHeader title={data.event.name} separator={false}>
	{#snippet button()}
		<div class="flex items-center gap-1">
			<Button variant="outline" target="_blank" href={previewUrl}
				>{m.alive_silly_antelope_build()}</Button
			>
			<Button href="/events/{data.event.id}/edit">{m.giant_misty_shrimp_stop()}</Button>
		</div>
	{/snippet}
</PageHeader>
<div class="text-muted-foreground space-y-2 mt-3">
	{#if renderAddress(data.event, data.t, data.instance.country).text.length > 0}<div
			class="flex items-center gap-1.5"
		>
			<MapPin size={16} />
			<a href={renderAddress(data.event, data.t, data.instance.country).url} target="_blank"
				>{renderAddress(data.event, data.t, data.instance.country).text}</a
			>
		</div>{/if}
	<div class="flex items-center gap-1.5">
		<CalendarClock size={16} />
		{formatDateTimeRange(data.event.starts_at, data.event.ends_at)}
	</div>
	<div class="flex items-center gap-1.5">
		<Link size={16} />
		<span class="text-muted-foreground text-sm">
			<span class="text-foreground">{previewUrl}</span>
		</span>
		<CopyButton textToCopy={previewUrl} />
	</div>
	<div class="flex items-center gap-1.5">
		<Whatsapp />
		<div class="flex items-center gap-2">
			<a
				href={renderRegistrationLink(data.instance, data.event).url}
				target="_blank"
				class="hover:underline cursor-pointer"
				>{renderRegistrationLink(data.instance, data.event).text}</a
			>
			<CopyButton textToCopy={registrationLink} />
		</div>
	</div>
	{#if data.event.online}
		<div class="flex items-center gap-1.5">
			<Link size={16} />
			<div>
				<a href={data.event.online_url} target="_blank">{data.event.online_url}</a>
				{#if data.event.online_instructions}
					<div class="text-muted-foreground text-xs">
						{data.event.online_instructions}
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<div class="flex justify-between items-baseline flex-wrap gap-4">
		<Tags type="events" personOrEventId={data.event.id} />
		<PointPerson type="event" objectId={data.event.id} admin={data.event.point_person}
			>{#snippet header()}{/snippet}</PointPerson
		>
	</div>
</div>
<div class="mt-12">
	<DataGrid title={m.petty_vexed_jurgen_nurture()} items={attendees} count={data.attendees.count}>
		{#snippet content(attendee: (typeof data.attendees.items)[0], index: number)}
			<div class="flex items-center justify-between gap-4">
				<PersonBadge person={attendee} />
				<EditRegistrationForm
					personId={attendee.person_id}
					status={attendee.status}
					sendNotifications={attendee.send_notifications}
				/>
			</div>
		{/snippet}
		{#snippet headerButton()}
			<div class="flex items-center gap-1">
				<Button variant="outline" target="_blank" href="/events/{data.event.id}/print"
					>{m.orange_mad_deer_value()}</Button
				>
				<Button href="/events/{data.event.id}/register">{m.ideal_active_ray_offer()}</Button>
			</div>
		{/snippet}
	</DataGrid>
	<div class="flex justify-end mt-4">
		<Button variant="destructive" onclick={deleteEvent}>{m.wide_major_pig_swim()}</Button>
	</div>
</div>
