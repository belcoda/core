<script lang="ts">
	import { type Read, type List } from '$lib/schema/communications/whatsapp/messages';
	let {
		messages = $bindable(),
		buttonIndex,
		messageIndex
	}: { messages: Read[]; buttonIndex: number; messageIndex: number } = $props();
	import Button from '$lib/comps/ui/button/button.svelte';

	import Trash from 'lucide-svelte/icons/trash';
	import CornerDownRight from 'lucide-svelte/icons/corner-down-right';
	import Input from '$lib/comps/ui/input/input.svelte';
	import * as buttonActions from '$lib/comps/forms/whatsapp/messages/builder/actions/buttons';

	import SelectActionDropdown from '$lib/comps/forms/whatsapp/messages/builder/edit/SelectActionDropdown.svelte';
	import EditAction from './EditAction.svelte';
</script>

<div class="grid grid-cols-1 gap-2">
	{#if messages[messageIndex].message.type === 'interactive'}
		{@const buttonId =
			messages[messageIndex].message.interactive.action.buttons[buttonIndex].reply.id}
		<div class="flex items-center gap-2">
			<div class="flex-grow">
				<Input
					bind:value={
						messages[messageIndex].message.interactive.action.buttons[buttonIndex].reply.title
					}
				/>
			</div>
			<Button
				variant="secondary"
				onclick={() =>
					(messages[messageIndex].message = buttonActions.removeButton(
						messages[messageIndex].message,
						buttonIndex
					))}><Trash size={16} /></Button
			>
		</div>
		<div class="grid grid-cols-1 gap-2">
			<div class="flex gap-2 items-start">
				<div class="flex gap-1 items-center mt-1">
					<CornerDownRight size={16} />
					<div class="text-xs font-bold">On Tap:</div>
				</div>
				<div class="grid grid-cols-1 gap-2">
					{#each messages[messageIndex].actions[buttonId] as action, i}
						<EditAction bind:messages {messageIndex} actionIndex={i} {buttonId} />
					{/each}
					<SelectActionDropdown bind:messages {buttonIndex} {messageIndex} />
				</div>
			</div>
		</div>
	{/if}
</div>
