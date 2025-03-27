<script lang="ts">
	import { page } from '$app/stores';
	import { type ListOfTags } from '$lib/schema/core/tags';
	import Plus from 'lucide-svelte/icons/plus';
	import * as m from '$lib/paraglide/messages';
	type Props = {
		selectedTags?: ListOfTags;
		tags?: ListOfTags;
		onAddTag: (tagId: number) => void;
		onRemoveTag: (tagId: number) => void;
		buttonText?: string;
		ButtonIcon?: Component | ComponentType;
	};
	let {
		selectedTags = $bindable([]),
		tags = $bindable([]),
		onAddTag,
		onRemoveTag,
		buttonText = m.least_crazy_gull_drum(),
		ButtonIcon = Plus
	}: Props = $props();
	let loading = $state(false);
	let open = $state(false);
	let selectableTags = $derived.by(() => {
		const taggingIds = new Set(selectedTags.map((t) => t.id));
		return tags.filter((tag) => !taggingIds.has(tag.id));
	});
	import { load as loadTags } from '$lib/comps/widgets/tags/tags';

	import * as Command from '$lib/comps/ui/command';
	import * as Popover from '$lib/comps/ui/popover';
	import Button, { buttonVariants } from '$lib/comps/ui/button/button.svelte';
	import { default as XIcon } from 'lucide-svelte/icons/x';
	import Badge from '$lib/comps/ui/badge/badge.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { onMount, type ComponentType, type Component } from 'svelte';
	import { cn } from '$lib/utils';
	onMount(async () => {
		loading = true;
		tags = await loadTags();
		loading = false;
	});

	async function handleAddTag(tagId: number) {
		loading = true;
		const index = tags.findIndex((tag) => tag.id === tagId);
		selectedTags = [...selectedTags, tags[index]];
		onAddTag(tagId);
		loading = false;
	}

	async function handleRemoveTag(tagId: number) {
		loading = true;
		const index = selectedTags.findIndex((tag) => tag.id === tagId);
		console.log(selectedTags);
		selectedTags = selectedTags.toSpliced(index, 1);
		console.log(selectedTags);
		onRemoveTag(tagId);
		loading = false;
	}
</script>

<div class="flex items-center justify-start gap-2 flex-wrap">
	{#each selectedTags as tag}
		<Badge class="justify-start gap-x-1 py-0 rounded-md"
			>{tag.name}
			<Button
				variant="ghost"
				size="xs"
				class="px-0 hover:bg-transparant hover:text-white"
				onclick={() => {
					console.log(tag);
					handleRemoveTag(tag.id);
				}}
			>
				<XIcon size={12} />
			</Button></Badge
		>
	{/each}
	{#if loading}
		<Badge
			class="justify-start gap-x-1 py-0 rounded-md animated animate-pulse text-muted-foreground"
			variant="secondary"
		>
			{m.loud_bland_lionfish_pray()}
			<LoaderCircle class="animated animate-spin" size={12} />
		</Badge>
	{/if}
	{@render popover()}
</div>
{#snippet popover()}
	<Popover.Root bind:open>
		<Popover.Trigger
			class={cn(
				buttonVariants({ variant: 'outline', size: 'xs' }),
				'justify-start gap-x-1 rounded-lg px-2 py-3'
			)}
		>
			<ButtonIcon size={14} />
			<div class="text-sm">{buttonText}</div>
		</Popover.Trigger>
		<Popover.Content class="p-0" align="start" side="right">
			<Command.Root>
				<Command.Input placeholder={m.small_equal_shad_walk()} />
				<Command.List>
					<Command.Empty>{m.deft_agent_parakeet_peek()}</Command.Empty>
					<Command.Group>
						{#each selectableTags as tag}
							<Command.Item
								value={tag.id.toString()}
								onSelect={() => {
									handleAddTag(Number(tag.id));
								}}
							>
								{tag.name}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{/snippet}
