<script lang="ts">
	import { page } from '$app/stores';
	import { type List } from '$lib/schema/people/lists';
	import { cn, debounce } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		list?: List['items'][number];
		lists?: List['items'];
		value?: number | null;
		label?: string;
		onSelectList?: (list: List['items'][number]) => void;
		children?: Snippet;
	};
	let {
		list = $bindable(),
		value = $bindable(),
		lists = $bindable([]),
		label = $page.data.t.forms.buttons.search(),
		onSelectList,
		children
	}: Props = $props();
	let loading = $state(false);
	let open = $state(false);

	import { load } from '$lib/comps/widgets/lists/actions';

	import * as Command from '$lib/comps/ui/command';
	import * as Popover from '$lib/comps/ui/popover';
	import { buttonVariants } from '$lib/comps/ui/button/button.svelte';
	import Plus from 'lucide-svelte/icons/plus';

	import { onMount } from 'svelte';
	onMount(async () => {
		loading = true;
		lists = await load(null);
		if (value) {
			const selectedList = lists.findIndex((l) => l.id === value);
			list = lists[selectedList];
		}
		loading = false;
	});

	async function handleAddPerson(listId: number) {
		value = listId;
		const selectedList = lists.findIndex((l) => l.id === listId);
		if (onSelectList) onSelectList(lists[selectedList]);
		list = lists[selectedList];
	}

	let searchString: string = $state('');

	async function search() {
		loading = true;
		lists = await load(searchString);
		loading = false;
	}
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
</script>

<div class="flex items-center justify-start gap-2 flex-wrap flex-grow">
	{@render popover()}
</div>
{#snippet popover()}
	<Popover.Root bind:open>
		<Popover.Trigger
			class={cn(
				buttonVariants({ variant: 'outline', size: 'sm' }),
				'justify-start gap-x-1 rounded-lg px-2 py-3 bg-white'
			)}
		>
			{#if list}
				{list.name} <ChevronDown size={14} />
			{:else if children}
				{@render children()}
			{:else}
				<Plus size={14} />
				<div class="text-sm">{label}</div>
			{/if}
		</Popover.Trigger>
		<Popover.Content class="p-0" align="start" side="right">
			<Command.Root>
				<Command.Input
					placeholder={$page.data.t.forms.fields.tags.filter_tags.label()}
					bind:value={searchString}
					oninput={debounce(search, 500)}
				/>
				<Command.List>
					{#if loading}
						<Command.Loading>{$page.data.t.common.status.loading()}</Command.Loading>
					{:else}
						<Command.Empty>{$page.data.t.common.data.no_items()}</Command.Empty>
						{#each lists as item, i}
							<Command.Item
								value={`${item.id}:::${item.name}`}
								forceMount={true}
								onSelect={() => {
									handleAddPerson(item.id);
									open = false;
								}}
							>
								{item.name}
							</Command.Item>
						{/each}
					{/if}
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{/snippet}
