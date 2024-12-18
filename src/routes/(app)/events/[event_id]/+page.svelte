<script lang="ts">
	const { data } = $props();
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';
	import { renderAddress } from '$lib/utils/text/address';
	import { formatDateTimeRange, formatDate } from '$lib/utils/text/date';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';
	import Link from 'lucide-svelte/icons/link';
	import { PUBLIC_HOST } from '$env/static/public';
	import { page } from '$app/stores';
	const url = new URL(PUBLIC_HOST);
	const previewUrl = `${url.protocol}//${$page.data.instance.slug}.${url.host}/events/${data.event.slug}`;
	import EditRegistrationForm from './EditRegistrationForm.svelte';
	import Tags from '$lib/comps/widgets/tags/Tags.svelte';
	import PointPerson from '$lib/comps/widgets/point_person/PointPerson.svelte';

	const attendanceStatus: ['registered', 'attended', 'cancelled', 'noshow'] = [
		'registered',
		'attended',
		'cancelled',
		'noshow'
	];
	const statusOptions = attendanceStatus.map((status) => ({
		value: status,
		label: data.t.events.status[status].title()
	}));

	const attendees = $state(data.attendees.items);

	function makeStatusOptions(status: (typeof attendanceStatus)[number]) {
		return {
			value: status,
			label: data.t.events.status[status].title()
		};
	}
</script>

<PageHeader title={data.event.name} separator={false}>
	{#snippet button()}
		<div class="flex items-center gap-1">
			<Button variant="outline" target="_blank" href={previewUrl}
				>{data.t.forms.buttons.preview()}</Button
			>
			<Button href="/events/{data.event.id}/edit">{data.t.forms.buttons.edit()}</Button>
		</div>
	{/snippet}
</PageHeader>
<div class="text-muted-foreground space-y-2 mt-3">
	{#if renderAddress(data.event, data.t).text.length > 0}<div class="flex items-center gap-1.5">
			<MapPin size={16} />
			<a href={renderAddress(data.event, data.t).url} target="_blank"
				>{renderAddress(data.event, data.t).text}</a
			>
		</div>{/if}
	<div class="flex items-center gap-1.5">
		<CalendarClock size={16} />
		{formatDateTimeRange(data.event.starts_at, data.event.ends_at)}
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
	<DataGrid title={data.t.pages.events.attendees()} items={attendees} count={data.attendees.count}>
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
			<Button href="/events/{data.event.id}/register"
				>{data.t.events.attendees.register.title()}</Button
			>
		{/snippet}
	</DataGrid>
</div>
