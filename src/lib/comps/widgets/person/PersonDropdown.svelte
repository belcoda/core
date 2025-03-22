<script lang="ts">
	import { page } from '$app/stores';
	import { type _ListWithSearch } from '$lib/schema/people/people';
	import { cn, debounce } from '$lib/utils';
	import type { Snippet } from 'svelte';
	type Props = {
		people?: _ListWithSearch['items'];
		person?: _ListWithSearch['items'][number];
		selectedPersonIds: number[];
		onAddPerson: (person: _ListWithSearch['items'][number]) => void;
		children?: Snippet;
	};
	let {
		people = $bindable([]),
		person = $bindable(),
		selectedPersonIds,
		onAddPerson,
		children
	}: Props = $props();
	let loading = $state(false);
	let open = $state(false);
	let selectablePeople = $derived(people.filter((p) => selectedPersonIds.indexOf(p.id) === -1));
	import * as m from '$lib/paraglide/messages';

	import { load } from '$lib/comps/widgets/person/actions';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';

	import * as Command from '$lib/comps/ui/command';
	import * as Popover from '$lib/comps/ui/popover';
	import Button, { buttonVariants } from '$lib/comps/ui/button/button.svelte';
	import Plus from 'lucide-svelte/icons/plus';

	import { onMount } from 'svelte';
	onMount(async () => {
		loading = true;
		people = await load(null);
		loading = false;
	});

	async function handleAddPerson(personId: number) {
		const selectedPerson = people.findIndex((p) => p.id === personId);
		onAddPerson(people[selectedPerson]);
		person = people[selectedPerson];
		selectedPersonIds = [...selectedPersonIds, personId];
	}

	let value: string | undefined = $state('');

	async function search() {
		loading = true;
		await load(value)
			.then((returnedPeople) => {
				people = returnedPeople;
			})
			.finally(() => {
				loading = false;
			});
	}
</script>

<div class="flex items-center justify-start gap-2 flex-wrap">
	{@render popover()}
</div>
{#snippet popover()}
	<Popover.Root bind:open>
		<Popover.Trigger
			class={cn(
				buttonVariants({ variant: 'outline', size: 'sm' }),
				'justify-start gap-x-1 rounded-lg px-2 py-3'
			)}
		>
			{#if children}
				{@render children()}
			{:else}
				<Plus size={14} />
				<div class="text-sm">{m.orange_inner_monkey_launch()}</div>
			{/if}
		</Popover.Trigger>
		<Popover.Content class="p-0" align="start" side="right">
			<Command.Root>
				<Command.Input
					placeholder={m.jumpy_alert_mouse_cry()}
					bind:value
					oninput={debounce(search, 500)}
				/>
				<Command.List>
					{#if loading}
						<Command.Loading class="p-2 text-foreground-muted"
							>{m.loud_bland_lionfish_pray()}</Command.Loading
						>
					{:else}
						<Command.Empty>{m.deft_agent_parakeet_peek()}</Command.Empty>
						{#each selectablePeople as person, i}
							<Command.Item
								forceMount={true}
								value={`${person.search}`}
								onSelect={() => {
									handleAddPerson(person.id);
									if (selectablePeople.length === 0) open = false;
								}}
							>
								<PersonBadge {person} linkToProfile={false} />
							</Command.Item>
						{/each}
					{/if}
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{/snippet}
