<script lang="ts">
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { debounce } from '$lib/utils';

	import { type Read, type List } from '$lib/schema/communications/whatsapp/messages';

	type Props = {
		message: Read;
		messages: List['items'];
		index: number;
		selectedIndex: number;
	};
	let { message = $bindable(), index, messages, selectedIndex }: Props = $props();

	let selected = $derived(selectedIndex === index);
	import Frame from '$lib/comps/forms/whatsapp/Frame.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import Textarea from '$lib/comps/ui/textarea/textarea.svelte';
	import Input from '$lib/comps/ui/input/input.svelte';
	import * as Select from '$lib/comps/ui/select';
	import FileUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';
	import X from 'lucide-svelte/icons/x';
	import Reply from 'lucide-svelte/icons/reply';
	import Forward from 'lucide-svelte/icons/forward';

	import {
		updateMessage,
		addImageToMessage,
		setActionInMessage,
		removeButtonFromMessage,
		addButtonToMessage,
		handleFileUpload,
		setNextMessage,
		removeActionInMessage,
		removeImageFromMessage,
		PLACEHOLDER_IMAGE_URL
	} from '$lib/comps/forms/whatsapp/messages/actions';

	async function update() {
		await updateMessage(message);
	}

	async function addButton() {
		message = addButtonToMessage(message);
		await update();
	}

	function removeImage() {
		message = removeImageFromMessage(message);
		update();
	}

	async function updateFile(url: string, fileName: string) {
		message = addImageToMessage(message);
		message = await handleFileUpload(message, url, fileName);
		update();
	}

	const messagesToSelect = $derived.by(() => {
		const currentMessageRemoved = messages.filter((m) => m.id !== message.id);
		return currentMessageRemoved.map((m) => ({ value: m.id, label: `MSGID:${m.id}` }));
	});

	import type { ActionArray } from '$lib/schema/communications/actions/actions';
	async function setAction(actionId: string, action: ActionArray[number]) {
		message = setActionInMessage(actionId, action, message);
		await update();
	}

	async function removeAction(actionId: string, actionType: string, message: Read) {
		const actionIndex = message.actions[actionId]?.findIndex((a) => a.type === actionType);
		message = removeActionInMessage(actionId, actionIndex, message);
		await update();
	}

	let selectedButtonIndex = $state(-1);
	let mostRecentUpdatedAction: string | undefined = $state(undefined); //this is a hack to make sure that when we kill the action using the button, the dropdown also clears.
</script>

{#if message.message.type === 'text'}
	<Frame {selected} messageId={message.id}>
		{message.message.text.body}
	</Frame>
{/if}

{#if message.message.type === 'interactive'}
	<Frame {selected} messageId={message.id}>
		{#if message.message.interactive.header && message.message.interactive.header.type === 'image'}
			{@render renderImage(message.message.interactive.header.image.link)}
		{/if}
		{#if message.message.interactive.body.text}
			<div>{message.message.interactive.body.text}</div>
		{/if}
		<div class="mt-2 min-w-[180px]">
			{#each message.message.interactive.action.buttons as button, i}
				<div class="flex items-center gap-1 border-t">
					<button
						onclick={() => (selectedButtonIndex = i)}
						class="flex flex-grow py-1.5 text-sm justify-center items-center gap-2 text-blue-600 padding cursor-pointer"
						class:text-white={selected}
					>
						{#if button.type === 'reply'}
							<Reply size={20} />
						{/if}
						<div>{button.title}</div>
					</button>
					<button
						onclick={() => {
							if (
								confirm(
									$page.data.t.forms.fields.communications.whatsapp.message_edit_form.delete_button_confirm()
								)
							) {
								message = removeButtonFromMessage(message, i);
								selectedButtonIndex = -1;
								update();
							}
						}}
					>
						<X size={16} />
					</button>
				</div>
				{@render editButton(i)}
			{/each}
		</div>
	</Frame>
{/if}

{#snippet editButton(index: number)}
	{#if selected && selectedButtonIndex === index && message.message.type === 'interactive'}
		<div
			class="bg-white shadow px-3 py-2 rounded mt-2 text-foreground"
			transition:slide={{ axis: 'y', duration: 200 }}
		>
			<Input
				maxlength={20}
				bind:value={message.message.interactive.action.buttons[index].title}
				oninput={debounce(update, 500)}
			/>

			<div>
				{@render manageButtonAction(message.message.interactive.action.buttons[index].id)}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet manageButtonAction(buttonId: string)}
	{@const selectedMessage = message.actions[buttonId]?.find(
		(a) => a.type === 'send_whatsapp_message'
	)?.message_id}
	{@const selected = { value: selectedMessage, label: `MSGID:${selectedMessage}` }}
	{#key mostRecentUpdatedAction}
		<div class="mt-1 text-muted-foreground flex items-center gap-2">
			<div><Forward size={18} /></div>
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
			<div>
				<Button
					size={'xs'}
					variant={'ghost'}
					onclick={() => {
						removeAction(buttonId, 'send_whatsapp_message', message);
						mostRecentUpdatedAction = buttonId;
					}}><X size={16} /></Button
				>
			</div>
		</div>
	{/key}
{/snippet}

{#if message.message.type === 'image'}
	<Frame {selected} messageId={message.id}>
		<div class="relative">
			<img
				src={message.message.image.link}
				alt="To be sent via whatsapp (no alt)"
				class="rounded"
				class:border={selected}
				class:border-2={selected}
				class:border-primary-500={selected}
			/>
			<div class="absolute top-0 right-0">
				<Button
					variant="ghost"
					size="xs"
					on:click={removeImage}
					class="text-xs text-gray-100 hover:text-white hover:bg-opacity-0"
				>
					<X size={16} /></Button
				>
			</div>
		</div>
		{#if message.message.image.caption}{message.message.image.caption}{/if}
	</Frame>
{/if}

{#if selectedIndex === index}
	<div
		class="bg-white shadow px-3 py-2 rounded mt-2"
		transition:slide={{ axis: 'y', duration: 200 }}
	>
		<div class="grid grid-cols-1 gap-2">
			{#if message.message.type === 'image' && message.message.image.link !== PLACEHOLDER_IMAGE_URL}<!--Nothing here, because we want the UNLESS case, to satisfy TS-->
			{:else}
				<FileUpload onUpload={(data) => updateFile(data.url, data.fileName)} />
			{/if}
			{#if message.message.type === 'text'}
				<Textarea bind:value={message.message.text.body} oninput={debounce(update, 500)} />
			{/if}
			{#if message.message.type === 'image'}
				<Textarea bind:value={message.message.image.caption} oninput={debounce(update, 500)} />
			{/if}
			{#if message.message.type === 'interactive'}
				<Textarea
					bind:value={message.message.interactive.body.text}
					oninput={debounce(update, 500)}
				/>
			{/if}
			{@render addButtonSnippet()}
			<!-- {@render nextMessageHandler()} -->
		</div>
	</div>
	<Separator class="my-2" />
{/if}

{#snippet nextMessageHandler()}
	{#if message.next}
		<div class="flex items-center justify-between mt-1">
			<div class="mt-1 text-xs text-muted-foreground">
				NEXT: MSGID:{message.next}
			</div>
			<div>
				<Button
					size="xs"
					variant="secondary"
					onclick={async () => {
						message = await setNextMessage(message.id, null);
					}}><X size={16} /></Button
				>
			</div>
		</div>
	{:else if message.message.type !== 'interactive'}
		<div class="mt-1 text-xs text-muted-foreground">
			<Select.Root
				items={messagesToSelect}
				onSelectedChange={async (val) => {
					if (val) {
						message = await setNextMessage(message.id, val.value);
					}
				}}
			>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="[Send message immediately]" />
				</Select.Trigger>
				<Select.Content>
					{#each messagesToSelect as m}
						<Select.Item value={m.value} label={m.label}>{m.label}</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input />
			</Select.Root>
		</div>
	{/if}
{/snippet}

{#snippet addButtonSnippet()}
	{#if message.message.type === 'interactive'}
		{#if message.message.interactive.action.buttons.length < 3}
			<Button variant="secondary" onclick={addButton}
				>{$page.data.t.forms.fields.communications.whatsapp.message_edit_form.add_button()}</Button
			>
		{/if}
	{:else}
		<Button variant="secondary" onclick={addButton}
			>{$page.data.t.forms.fields.communications.whatsapp.message_edit_form.add_button()}</Button
		>
	{/if}
{/snippet}

{#snippet renderImage(url: string)}
	<div class="relative">
		<img
			src={url}
			alt="To be sent via whatsapp (no alt)"
			class="rounded"
			class:border={selected}
			class:border-2={selected}
			class:border-primary-500={selected}
		/>
		<div class="absolute top-0 right-0">
			<Button
				variant="ghost"
				size="xs"
				on:click={removeImage}
				class="text-xs text-gray-100 hover:text-white hover:bg-opacity-0"
			>
				<X size={16} /></Button
			>
		</div>
	</div>
{/snippet}
