<script lang="ts">
	const { data } = $props();
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import H2 from '$lib/comps/typography/H2.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as Tabs from '$lib/comps/ui/tabs/index.js';

	import * as m from '$lib/paraglide/messages';

	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';
	import User from 'lucide-svelte/icons/user';
	import Link from 'lucide-svelte/icons/link';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';

	import { renderAddress } from '$lib/utils/text/address';
	import { formatDateTimeRange } from '$lib/utils/text/date';
	let contentType: 'posts' | 'pages' = $state('posts');

	const dataGridOptions = {
		showHeader: false,
		fullWidthFilter: true,
		showFilter: false,
		showTopSeparator: false,
		showBottomSeparator: false
	};
</script>

{#snippet head(headline: string, buttonText: string, buttonHref: string)}
	<div class="flex justify-between items-center w-full mb-4">
		<div><H2>{headline}</H2></div>
		<div><Button variant="outline" href={buttonHref}>{buttonText}</Button></div>
	</div>
{/snippet}

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
	<div>
		{@render head(m.same_fluffy_yak_urge(), m.lime_round_barbel_cheer(), '/people')}
		<DataGrid items={data.people.items} count={data.people.count} options={dataGridOptions}>
			{#snippet content(person: (typeof data.people.items)[0])}
				<div class="flex justify-between items-center w-full">
					<div><PersonBadge {person} /></div>
					<div>
						<Button variant="outline" href="/people/{person.id}"
							>{m.dull_fluffy_jannes_hike()}</Button
						>
					</div>
				</div>
			{/snippet}
		</DataGrid>
	</div>

	<div>
		{@render head(m.proud_full_sawfish_belong(), m.lime_round_barbel_cheer(), '/people/groups')}
		<DataGrid items={data.groups.items} count={data.groups.count} options={dataGridOptions}>
			{#snippet content(group: (typeof data.groups.items)[0])}
				<div class="flex justify-between items-center w-full">
					<div>
						<div class="font-medium">{group.name}</div>
						<div class="flex items-center gap-1 text-muted-foreground text-sm">
							<User size={14} />
							{group.count}
						</div>
					</div>

					<div>
						<Button variant="outline" href="/people/groups/{group.id}"
							>{m.dull_fluffy_jannes_hike()}</Button
						>
					</div>
				</div>
			{/snippet}
		</DataGrid>
	</div>

	<div>
		{@render head(m.hour_quick_ostrich_climb(), m.lime_round_barbel_cheer(), '/events')}
		<DataGrid items={data.events.items} count={data.events.count} options={dataGridOptions}>
			{#snippet content(event: (typeof data.events.items)[0])}
				{@render eventLine(event)}
			{/snippet}
		</DataGrid>
	</div>

	<div>
		<Tabs.Root class="w-full" bind:value={contentType}>
			<div class="flex justify-between items-center w-full">
				<div>
					<H2>{contentType === 'pages' ? m.glad_least_samuel_fall() : m.trite_fun_falcon_tend()}</H2
					>
				</div>
				<div class="flex items-center gap-2">
					<Tabs.List class="">
						<Tabs.Trigger value="posts">{m.trite_fun_falcon_tend()}</Tabs.Trigger>
						<Tabs.Trigger value="pages">{m.glad_least_samuel_fall()}</Tabs.Trigger>
					</Tabs.List>
					<Button href="/website/{contentType}">{m.lime_round_barbel_cheer()}</Button>
				</div>
			</div>
			<Tabs.Content value="posts">
				<DataGrid items={data.posts.items} count={data.posts.count} options={dataGridOptions}>
					{#snippet content(post: (typeof data.posts.items)[0])}
						<div class="flex justify-between items-center w-full">
							<div class="font-medium">{post.name}</div>

							<div>
								<Button variant="outline" href="/website/posts/{post.id}"
									>{m.dull_fluffy_jannes_hike()}</Button
								>
							</div>
						</div>
					{/snippet}
				</DataGrid>
			</Tabs.Content>
			<Tabs.Content value="pages">
				<DataGrid items={data.pages.items} count={data.pages.count} options={dataGridOptions}>
					{#snippet content(page: (typeof data.pages.items)[0])}
						<div class="flex justify-between items-center w-full">
							<div class="font-medium">{page.name}</div>

							<div>
								<Button variant="outline" href="/website/pages/{page.id}"
									>{m.dull_fluffy_jannes_hike()}</Button
								>
							</div>
						</div>
					{/snippet}
				</DataGrid>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>

{#snippet eventLine(item: (typeof data.events.items)[0])}
	<div class="items-center flex justify-between gap-4">
		<div>
			<a href="/events/{item.id}">
				<div class="font-medium text-md">{item.name}</div>

				{#if item.online && item.online_url && item.online_url !== ''}
					<div class="text-muted-foreground text-sm flex items-center gap-1">
						<Link size={16} />
						{item.online_url}
					</div>
				{:else if renderAddress(item, data.instance.country).text !== ''}
					<div class="text-muted-foreground text-sm flex items-center gap-1">
						<MapPin size={16} />
						{renderAddress(item, data.instance.country).text}
					</div>
				{/if}
				<div class="text-muted-foreground flex items-center gap-1 text-sm">
					<CalendarClock size={16} />
					{formatDateTimeRange(item.starts_at, item.ends_at)}
					({data.timeAgo.format(item.starts_at)})
				</div>
			</a>
		</div>
		<div>
			<div class="flex gap-4 items-center justify-end">
				<Button variant="outline" href="/events/{item.id}">{m.dull_fluffy_jannes_hike()}</Button>
			</div>
		</div>
	</div>
{/snippet}
