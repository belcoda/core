<script lang="ts">
	export let data;
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import type { List } from '$lib/schema/events/events';
	import { renderAddress } from '$lib/utils/text/address';
	import { formatDateTimeRange } from '$lib/utils/text/date';
	import AdminBadge from '$lib/comps/widgets/AdminBadge.svelte';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Link from 'lucide-svelte/icons/link';
	import * as m from '$lib/paraglide/messages';
</script>

<DataGrid
	items={data.events.items}
	count={data.events.count}
	title={m.loose_cool_herring_quiz()}
	newItemHref="/events/new"
	options={{ nothingFoundMessage: m.sharp_honest_cheetah_evoke() }}
>
	{#snippet headerButton()}
		<Button href="/events/new">{m.shy_giant_rat_bake()}</Button>
	{/snippet}
	{#snippet content(item: List['items'][0])}
		<div class="items-center flex justify-between gap-4">
			<div>
				<a href="/events/{item.id}">
					<div class="font-medium text-md">{item.name}</div>

					{#if item.online && item.online_url && item.online_url !== ''}
						<div class="text-muted-foreground text-sm flex items-center gap-1">
							<Link size={16} />
							{item.online_url}
						</div>
					{:else if renderAddress(item, data.t, data.instance.country).text !== ''}
						<div class="text-muted-foreground text-sm flex items-center gap-1">
							<MapPin size={16} />
							{renderAddress(item, data.t, data.instance.country).text}
						</div>
					{/if}
					<div class="text-muted-foreground flex items-center gap-1">
						<CalendarClock size={16} />
						{formatDateTimeRange(item.starts_at, item.ends_at)}
						({data.timeAgo.format(item.starts_at)})
					</div>
				</a>
			</div>
			<div>
				<div class="flex gap-4 items-center justify-end">
					<AdminBadge admin={item.point_person} />
					<Button href="/events/{item.id}" variant="outline">{m.dull_fluffy_jannes_hike()}</Button>
				</div>
			</div>
		</div>
	{/snippet}
</DataGrid>
