<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	const { data } = $props();
	import { page } from '$app/state';
	import { type List } from '$lib/schema/events/attendees';
	import * as Table from '$lib/comps/ui/table/index';
	import { convertToTimezone } from '$lib/utils/date/datetime.js';
	//Have to use parseInt because Number(page.url.searchParams.get('additionalRows')) returns 0 when null
	const amountOfAdditionalRows = isNaN(parseInt(page.url.searchParams.get('additionalRows') || ''))
		? 20
		: Number(page.url.searchParams.get('additionalRows'));
	const registered = $derived(() => {
		return data.attendees.filter((attendee) => attendee.status === 'registered');
	});
	const attended = $derived(() => {
		return data.attendees.filter((attendee) => attendee.status === 'attended');
	});
	const cancelled = $derived(() => {
		return data.attendees.filter((attendee) => attendee.status === 'cancelled');
	});

	import { renderAddress } from '$lib/utils/text/address';
	import { formatDateTimeRange, formatDate } from '$lib/utils/text/date';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';
	import Link from 'lucide-svelte/icons/link';

	import { onMount } from 'svelte';
	onMount(() => {
		window.print();
	});
</script>

<div class="max-w-4xl mx-auto py-8 px-4">
	<div class="font-bold text-4xl">{data.event.heading}</div>

	<div class="text-muted-foreground space-y-2 mt-3">
		{#if renderAddress(data.event, data.instance.country).text.length > 0}<div
				class="flex items-center gap-1.5"
			>
				<MapPin size={16} />
				<a href={renderAddress(data.event, data.instance.country).url} target="_blank"
					>{renderAddress(data.event, data.instance.country).text}</a
				>
			</div>{/if}
		<div class="flex items-center gap-1.5">
			<CalendarClock size={16} />
			{formatDateTimeRange(
				convertToTimezone(data.event.starts_at, data.event.timezone),
				convertToTimezone(data.event.ends_at, data.event.timezone),
				undefined,
				data.event.timezone
			)}
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
	</div>

	{#if registered().length > 0}
		<div class="text-lg font-bold mt-6 mb-3">{m.same_fun_elephant_arrive()}</div>
		<Table.Root>
			{@render tableHeader()}
			<Table.Body>
				{#each registered() as person}
					{@render row(person)}
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}

	{#if attended().length > 0}
		<div class="text-lg font-bold mt-6 mb-3">{m.upper_lime_giraffe_vent()}</div>
		<Table.Root>
			{@render tableHeader()}
			<Table.Body>
				{#each attended() as person}
					{@render row(person)}
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}

	{#if cancelled().length > 0}
		<div class="text-lg font-bold mt-6 mb-3">{m.equal_dull_kestrel_honor()}</div>
		<Table.Root>
			{@render tableHeader()}
			<Table.Body>
				{#each cancelled() as person}
					{@render row(person)}
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}

	{#if amountOfAdditionalRows > 0}
		<div class="text-lg font-bold mt-6 mb-3">{m.royal_civil_gull_succeed()}</div>
		<Table.Root>
			{@render tableHeader()}
			<Table.Body>
				{#each Array(amountOfAdditionalRows) as _, i}
					{@render additionalRow()}
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>

{#snippet tableHeader()}
	<Table.Header>
		<Table.Row>
			<Table.Head>{m.icy_weird_albatross_read()}</Table.Head>
			<Table.Head>{m.factual_soft_gadfly_nudge()}</Table.Head>
			<Table.Head>{m.true_early_cow_pride()}</Table.Head>
			<Table.Head>{m.stock_direct_mole_stir()}</Table.Head>
		</Table.Row>
	</Table.Header>
{/snippet}

{#snippet row(person: List['items'][0])}
	<Table.Row>
		<Table.Cell class="font-medium w-1/4">{person.full_name}</Table.Cell>
		<Table.Cell class="w-1/4">{person.phone_number?.phone_number}</Table.Cell>
		<Table.Cell class="w-1/4">{person.email?.email}</Table.Cell>
		<Table.Cell class="text-right w-1/4">{@render attendanceStatus()}</Table.Cell>
	</Table.Row>
{/snippet}

{#snippet additionalRow()}
	<Table.Row>
		<Table.Cell class="font-medium w-1/4"></Table.Cell>
		<Table.Cell class="w-1/4"></Table.Cell>
		<Table.Cell class="w-1/4"></Table.Cell>
		<Table.Cell class="text-right ">{@render attendanceStatus()}</Table.Cell>
	</Table.Row>
{/snippet}

{#snippet attendanceStatus()}
	<div class="flex gap-4 text-left">
		<div>
			<div class="flex justify-center mb-1"><div class="border border-black w-4 h-4"></div></div>
			<div class="text-xs font-medium">{m.upper_lime_giraffe_vent()}</div>
		</div>
		<div>
			<div class="flex justify-center mb-1"><div class="border border-black w-4 h-4"></div></div>
			<div class="text-xs font-medium">{m.east_gray_fly_enchant()}</div>
		</div>
	</div>
{/snippet}
