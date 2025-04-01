<script lang="ts">
	const { data } = $props();

	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	const flash = getFlash(page);

	import { type Template as TemplateType } from '$lib/schema/communications/whatsapp/elements/template_message';
	import { type List } from '$lib/schema/communications/whatsapp/messages';

	import * as componentActions from '$lib/comps/forms/whatsapp/messages/builder/actions/components';
	import * as threadActions from '$lib/comps/forms/whatsapp/messages/builder/actions/thread';
	import { createNewMessage } from '$lib/comps/forms/whatsapp/messages/builder/actions/messages';

	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Loading from '$lib/comps/helpers/Loading.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';

	import TemplateSelectDropdown from '$lib/comps/forms/whatsapp/messages/builder/templates/select/Dropdown.svelte';
	import Message from '$lib/comps/forms/whatsapp/messages/builder/Message.svelte';
	import CreateNewMessage from '$lib/comps/forms/whatsapp/messages/builder/CreateNewMessage.svelte';
	import Template from '$lib/comps/forms/whatsapp/messages/builder/templates/Template.svelte';

	const startingCompoments = () => {
		return template
			? componentActions.createMessageComponentsFromTemplateComponents(
					template.message.components,
					actions, //default
					data.templateMessage.message
				).components
			: [];
	};

	import { onMount } from 'svelte';
	onMount(async () => {
		loading = true;
		const fetchedMessages = await threadActions.fetchMessages(data.thread.id); //to avoid messages become a Promise type
		messages = fetchedMessages;
		loading = false;
	});

	let actions = $state({ ...data.templateMessage.actions });
	let templateMessage = $state({ ...data.templateMessage.message });
	let selectedMessageId: string | null = $state(null);
	let templateId = $state(data.thread.template_id);
	const template = $derived(data.templates.items.find((template) => template.id === templateId));
	let components: TemplateType['components'] = $state(startingCompoments());
	let loading: boolean = $state(false);
	let messages: List['items'] = $state([]);

	async function saveThread() {
		try {
			loading = true;
			if (template && templateMessage.type === 'template') {
				await threadActions.updateThread({
					templateMessage,
					templateId,
					actions,
					threadId: data.thread.id,
					templateName: templateMessage.template.name, //template
					components,
					messageId: data.thread.template_message_id
				});
				$flash = { type: 'success', message: 'Message saved' };
			}
		} catch (err) {
			console.log(err);
			if (err instanceof Error) {
				$flash = { type: 'error', message: err.message };
			} else {
				$flash = { type: 'error', message: 'An error occurred' };
			}
		} finally {
			loading = false;
		}
	}
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={'Edit thread'}>
	{#snippet button()}
		<div class="flex justify-end gap-2">
			<Button variant="secondary" href="/communications/whatsapp/{data.thread.id}/sends">
				Send
			</Button>
			<Button onclick={saveThread}>{m.empty_warm_squirrel_chop()}</Button>
		</div>
	{/snippet}
</PageHeader>
<div class="relative">
	<div class="w-full mt-6 mb-2">
		<div class="flex justify-center mb-4">
			<TemplateSelectDropdown
				value={templateId}
				onselect={async (template) => {
					templateId = template.id;
					const output = componentActions.createMessageComponentsFromTemplateComponents(
						template.message.components,
						actions,
						templateMessage
					);
					if ('template' in templateMessage) {
						//should always be true
						templateMessage.template.name = template.message.name;
						templateId = template.id;
					}
					components = output.components;
					actions = output.actions;
					await saveThread();
					loading = false;
				}}
			/>
		</div>
		<div
			class="flex cursor-pointer"
			onclick={() => (selectedMessageId = 'template')}
			role="button"
			tabindex={0}
			onkeydown={() => (selectedMessageId = 'template')}
		>
			<Template
				{messages}
				bind:actions
				bind:selectedMessageId
				{template}
				bind:components
				onSaveTemplate={saveThread}
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-2">
		{#each messages as message, i}
			<div
				class="flex cursor-pointer"
				onclick={() => (selectedMessageId = message.id)}
				role="button"
				tabindex={i + 1}
				onkeydown={() => (selectedMessageId = message.id)}
			>
				<Message bind:loading bind:selectedMessageId index={i} bind:messages />
			</div>
		{/each}
		<div class="mt-4">
			<CreateNewMessage
				oncreate={async (message) => {
					loading = true;
					await createNewMessage(message, data.thread.id);
					messages = await threadActions.fetchMessages(data.thread.id);
					loading = false;
				}}
			/>
		</div>
	</div>
	{#if loading}<div
			class="absolute inset-0 z-10 opacity-50 bg-white flex justify-center items-center"
		>
			<Loading />
		</div>{/if}
</div>
