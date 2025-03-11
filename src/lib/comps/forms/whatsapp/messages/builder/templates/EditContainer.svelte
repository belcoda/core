<script lang="ts">
	import * as Drawer from '$lib/comps/ui/drawer/index';
	import { type Read } from '$lib/schema/communications/whatsapp/template';
	import { type Template as TemplateType } from '$lib/schema/communications/whatsapp/elements/template_message';
	import { type List } from '$lib/schema/communications/whatsapp/messages';
	import { type Read as ReadThread } from '$lib/schema/communications/whatsapp/threads';
	type Props = {
		selectedMessageId: string | null;
		messages: List['items'];
		actions: ReadThread['actions'];
		onSaveTemplate: (template: Read, actions: ReadThread['actions']) => void;
		template: Read | undefined;
		components: TemplateType['components'];
	};
	let {
		selectedMessageId = $bindable(),
		messages,
		onSaveTemplate,
		actions = $bindable(),
		template = $bindable(),
		components = $bindable()
	}: Props = $props();
	const selected = $derived(selectedMessageId === 'template');
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/comps/ui/button/index';
	import Input from '$lib/comps/ui/input/input.svelte';
	import FileUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';
	import EditButton from '$lib/comps/forms/whatsapp/messages/builder/templates/EditButton.svelte';
	import PreviewTemplate from '$lib/comps/forms/whatsapp/messages/builder/templates/Display.svelte';
</script>

{#if template}
	<Drawer.Root
		open={selected}
		onClose={async () => {
			await onSaveTemplate(template, actions);
			selectedMessageId = null;
		}}
	>
		<Drawer.Portal>
			<Drawer.Overlay class="fixed inset-0 bg-black/40" />
			<Drawer.Content
				class="flex flex-col mx-auto max-w-4xl fixed bottom-0 left-0 right-0 max-h-[96%]"
			>
				<div id="preview" class="bg-gray-100 p-4 border-b">
					<div class="max-w-sm mx-auto">
						<h3 class="text-sm font-medium mb-2 text-gray-700">WhatsApp Message Preview</h3>
						<div class="bg-white rounded-lg shadow-sm">
							{#if template}
								<PreviewTemplate template={template.message} selected={false} {components} />
							{/if}
						</div>
					</div>
				</div>

				<div class="w-full mx-auto overflow-auto p-4 grid grid-cols-1 gap-4">
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
										<!-- If parameter is payload, then the component type is button-->
										<EditButton
											{messages}
											componentIndex={i}
											buttonId={components[i].parameters[j].payload}
											buttonIndex={j}
											bind:actions
											{template}
											onSave={async (newActions) => {
												actions = newActions;
											}}
										/>
									{/if}
								{/each}
							</div>
						{/if}
					{/each}
				</div>
				<Drawer.Footer>
					<Drawer.Close class={cn(buttonVariants({ size: 'sm', variant: 'default' }))}
						>Save</Drawer.Close
					>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{/if}
