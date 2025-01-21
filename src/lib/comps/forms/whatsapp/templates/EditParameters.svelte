<script lang="ts">
	import { page } from '$app/stores';
	import { type Template as TemplateType } from '$lib/schema/communications/whatsapp/elements/template_message';
	import { list, type List } from '$lib/schema/communications/whatsapp/messages';
	import { type Read as ReadThread } from '$lib/schema/communications/whatsapp/threads';

	type Props = {
		components: TemplateType['components'];
		messages: List['items'];
		actions: ReadThread['actions'];
	};
	let { components = $bindable(), messages, actions = $bindable() }: Props = $props();
	import * as Select from '$lib/comps/ui/select';
	import Input from '$lib/comps/ui/input/input.svelte';
	import FileUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';

	const messagesToSelect = $derived(messages.map((m) => ({ value: m.id, label: `MSGID:${m.id}` })));
	import type { ActionArray } from '$lib/schema/communications/actions/actions';

	function setAction(actionId: string, action: ActionArray[number]) {
		if (Array.isArray(actions[actionId])) {
			const existingTypeIndex = actions[actionId].findIndex((a) => a.type === action.type);
			if (existingTypeIndex !== -1) {
				//we've already got this action type for this action, so let's replace it
				actions[actionId][existingTypeIndex] = action;
			} else {
				//no existing action of this type, let's add
				actions[actionId].push(action);
			}
		}
	}
</script>

{#each components as component, i}
	<div class="text-sm font-light tracking-wider uppercase">{component.type}</div>
	{#if component.parameters.length > 0}
		<div class="grid grid-cols-1 gap-2 py-2">
			{#each component.parameters as _, j}
				{#if components[i].parameters[j].type === 'text'}
					<Input bind:value={components[i].parameters[j].text} />
				{/if}
				{#if components[i].parameters[j].type === 'image'}
					<FileUpload
						onUpload={(data) => {
							const url = data.url;
							if (components[i].parameters[j].type === 'image') {
								components[i].parameters[j].image.link = url;
							}
						}}
					/>
				{/if}
				{#if components[i].parameters[j].type === 'payload'}
					{@render selectMessage(components[i].parameters[j].payload)}
				{/if}
			{/each}
		</div>
	{/if}
{/each}

{#snippet selectMessage(buttonId: string)}
	{@const selectedMessage = actions[buttonId]?.find(
		(a) => a.type === 'send_whatsapp_message'
	)?.message_id}
	{@const selected = { value: selectedMessage, label: `MSGID:${selectedMessage}` }}
	<div class="mt-1 text-muted-foreground flex items-center gap-2">
		<div class="flex-grow">
			<Select.Root
				{selected}
				items={messagesToSelect}
				onSelectedChange={async (val) => {
					if (val && val.value) {
						const action = {
							type: 'send_whatsapp_message' as const,
							message_id: val.value
						};
						await setAction(buttonId, action);
					}
				}}
			>
				<Select.Trigger class="w-full flex-grow">
					<Select.Value
						placeholder={$page.data.t.forms.fields.communications.whatsapp.send_message.placeholder()}
					/>
				</Select.Trigger>
				<Select.Content>
					{#each messagesToSelect as m}
						<Select.Item value={m.value} label={m.label}>{m.label}</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input />
			</Select.Root>
		</div>
	</div>
{/snippet}
