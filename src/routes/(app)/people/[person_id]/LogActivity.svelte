<script lang="ts">
	import { page } from '$app/stores';
	import * as Select from '$lib/comps/ui/select';
	import Input from '$lib/comps/ui/input/input.svelte';
	import TextArea from '$lib/comps/ui/textarea/textarea.svelte';
	import * as m from '$lib/paraglide/messages';
	type InteractionType =
		| 'notes'
		| 'phone_call_outbound'
		| 'phone_call_inbound'
		| 'outbound_whatsapp';
	import Button from '$lib/comps/ui/button/button.svelte';
	import sendWhatsappMessage from '$lib/comps/widgets/interactions/sendWhatsappMessage.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	const types: { value: InteractionType; label: string }[] = [
		{ value: 'notes', label: m.teal_careful_ox_ascend() },
		{
			value: 'outbound_whatsapp',
			label: m.loved_dirty_haddock_hint()
		}
	];
	let selected = $state(types[0].value);
	import { type List } from '$lib/schema/people/interactions';
	const {
		onLogged,
		personId
	}: { personId: number; onLogged: (interaction?: List['items'][number]) => void } = $props();
	import { getFlash } from 'sveltekit-flash-message';
	let flash = getFlash(page);
	let notes: string | undefined = $state(undefined);
	let isPosting: boolean = $state(false);

	let activeConversation: boolean = $state(false);
	let activeConversationLoading: boolean = $state(false);

	async function getConversationStatus() {
		try {
			activeConversationLoading = true;
			activeConversation = false;
			const response = await fetch(
				`/api/v1/people/${personId}/communication/whatsapp/conversations`
			);
			if (response.ok) {
				const body = await response.json();
				if (body.active) activeConversation = body.active;
			} else {
				throw new Error();
			}
		} catch (err) {
			if (err instanceof Error) {
				$flash = { type: 'error', message: err?.message || m.teary_dizzy_earthworm_urge() };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		} finally {
			activeConversationLoading = false;
		}
	}
	import { onMount } from 'svelte';
	import { sanitizeHTML } from '$lib/utils/text/string';
	onMount(() => {
		document.body.addEventListener('keydown', async (e: KeyboardEvent) => {
			if (!(e.key === 'Enter' && (e.metaKey || e.ctrlKey))) return;
			if (e.target && 'form' in e.target) {
				await logInteraction();
			}
		});
	});

	async function logInteraction(e?: SubmitEvent) {
		try {
			if (e) e.preventDefault();
			isPosting = true;

			if (selected === 'outbound_whatsapp' && notes) {
				await sendWhatsappMessage(notes, personId, $page.data.admin.id);
				onLogged();
			}
			// we want to allow for linebreaks and basic markdown formatting in notes
			const formattedNotes = selected === 'notes' && notes ? sanitizeHTML(notes) : notes;

			const body = {
				details: { type: selected, notes: formattedNotes },
				admin_id: $page.data.admin.id,
				person_id: personId
			};
			const response = await fetch(`/api/v1/people/${$page.data.person.id}/interactions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (response.ok) {
				const output: List['items'][number] = await response.json();
				onLogged(output);
			} else {
				throw new Error();
			}
			$flash = { type: 'success', message: m.flat_sleek_millipede_agree() };
		} catch (err) {
			if (err instanceof Error) {
				$flash = { type: 'error', message: err?.message || m.teary_dizzy_earthworm_urge() };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		} finally {
			isPosting = false;
		}
	}
</script>

<div
	class={`border rounded-sm shadow-sm p-3 ${selected === 'notes' ? 'bg-yellow-100' : selected === 'outbound_whatsapp' ? 'bg-blue-100' : 'bg-white'} relative`}
>
	{#if isPosting}
		<div
			class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-sm"
		>
			<div class="animate-spin text-primary">
				<LoaderCircle size={24} />
			</div>
		</div>
	{/if}
	<form onsubmit={logInteraction}>
		<div class="grid items-baseline gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
			{@render selectType()}
			<div class="col-span-1 md:col-span-2 lg:col-span-3">
				{#if selected === 'outbound_whatsapp'}
					{#if activeConversationLoading}
						{m.loud_bland_lionfish_pray()}
					{:else if activeConversation}
						<Input
							bind:value={notes}
							name="message"
							class="flex items-center h-10 w-full rounded px-3 text-sm"
							type="text"
							placeholder={m.hour_merry_felix_edit()}
						/>
					{:else}
						{@render noWhatsappConversation()}
					{/if}
				{:else}
					<TextArea
						bind:value={notes}
						name="message"
						class="flex items-center h-10 w-full rounded px-3 text-sm"
						rows={1}
						placeholder={m.spicy_agent_sheep_dance()}
					/>
				{/if}
			</div>
		</div>

		<div class="sm:flex sm:justify-end mt-3">
			{#if selected !== 'outbound_whatsapp' || activeConversation}
				<Button
					class="w-full sm:w-auto"
					type="submit"
					variant="default"
					size="sm"
					disabled={isPosting}
				>
					{#if isPosting}
						<div class="flex items-center gap-2">
							<span class="animate-spin"><LoaderCircle size={16} /></span>
							<span>{m.loud_bland_lionfish_pray()}</span>
						</div>
					{:else}
						{m.just_away_horse_urge()}
					{/if}
				</Button>
			{/if}
		</div>
	</form>
</div>

{#snippet selectType()}
	<Select.Root
		items={types}
		type="single"
		bind:value={selected}
		onValueChange={async (val) => {
			if (val && val === 'outbound_whatsapp') {
				await getConversationStatus();
			}
		}}
	>
		<Select.Trigger class="w-full">
			{types.find((t) => t.value === selected)?.label || '[Interaction]'}
		</Select.Trigger>
		<Select.Content>
			{#each types as type}
				<Select.Item value={type.value} label={type.label} class="flex items-center gap-2">
					{type.label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{/snippet}

{#snippet noWhatsappConversation()}
	<div class="text-muted-foreground text-sm flex justify-center text-center">
		{m.loved_nice_vulture_fall()}
	</div>
	<div class="flex justify-center mt-2">
		<Button variant="secondary" href="/communications/whatsapp/new"
			>{m.gaudy_sour_reindeer_borrow()}</Button
		>
	</div>
{/snippet}
