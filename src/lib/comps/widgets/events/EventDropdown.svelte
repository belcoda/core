<script lang="ts">
	import { page } from '$app/stores';
	import { type List } from '$lib/schema/events/events';
	import { debounce } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		item?: List['items'][number];
		items?: List['items'];
		value?: number | null;
		onselect: (item: List['items'][number]) => void;
		children?: Snippet;
	};
	let {
		item = $bindable(),
		value = $bindable(),
		items = $bindable([]),
		onselect,
		children
	}: Props = $props();
	let loading = $state(false);
	let open = $state(false);

	import { load } from '$lib/comps/widgets/events/actions';

	import * as Command from '$lib/comps/ui/command';
	import * as Popover from '$lib/comps/ui/popover';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Plus from 'lucide-svelte/icons/plus';

	import { onMount } from 'svelte';
	onMount(async () => {
		loading = true;
		items = await load(null);
		if (value) {
			const selectedList = items.findIndex((i) => i.id === value);
			item = items[selectedList];
		}
		loading = false;
	});

	async function handleAdd(itemId: number) {
		value = itemId;
		const selected = items.findIndex((i) => i.id === itemId);
		onselect(items[selected]);
		item = items[selected];
	}

	let searchString: string = $state('');

	async function search() {
		loading = true;
		items = await load(searchString);
		loading = false;
	}
</script>

<div class="flex items-center justify-start gap-2 flex-wrap">
	{@render popover()}
</div>
{#snippet popover()}
	<Popover.Root bind:open>
		<Popover.Trigger>
			<Button size="sm" variant="outline" class="justify-start gap-x-1 rounded-lg px-2 py-3">
				{#if item}
					{item.name}
				{:else if children}
					{@render children()}
				{:else}
					<Plus size={14} />
					<div class="text-sm">{$page.data.t.forms.buttons.search()}</div>
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="p-0" align="start" side="right">
			<Command.Root>
				<Command.Input
					placeholder={$page.data.t.common.actions.search()}
					bind:value={searchString}
					oninput={debounce(search, 500)}
				/>
				<Command.List>
					{#if loading}
						<Command.Loading>{$page.data.t.common.status.loading()}</Command.Loading>
					{:else}
						<Command.Empty>{$page.data.t.common.data.no_items()}</Command.Empty>
						{#each items as object, i}
							<Command.Item
								value={`${object.id}:::${object.name}`}
								onSelect={() => {
									handleAdd(object.id);
									open = false;
								}}
							>
								{object.name}
							</Command.Item>
						{/each}
					{/if}
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{/snippet}
