<script lang="ts">
	import { type Read } from '$lib/schema/communications/whatsapp/messages';
	let {
		messages = $bindable(),
		buttonIndex,
		messageIndex
	}: { messages: Read[]; buttonIndex: number; messageIndex: number } = $props();
	import * as DropdownMenu from '$lib/comps/ui/dropdown-menu';
	import Plus from 'lucide-svelte/icons/plus';
	import { buttonVariants } from '$lib/comps/ui/button/index';
	import { cn } from '$lib/utils';
	import * as actionsActions from '$lib/comps/forms/whatsapp/messages/builder/actions/actions';
</script>

{#if messages[messageIndex].message.type === 'interactive'}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={cn('flex items-center gap-2', buttonVariants({ variant: 'outline', size: 'xs' }))}
		>
			<Plus size={16} />
			<div class="text-xs font-bold">Add effect</div>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Item
					onclick={() => {
						if (messages[messageIndex].message.type === 'interactive') {
							messages[messageIndex].actions = actionsActions.createWhatsAppMessageAction(
								messages[messageIndex].message.interactive.action.buttons[buttonIndex].reply.id,
								messages[messageIndex].actions
							);
						}
					}}>Send WhatsApp Message</DropdownMenu.Item
				>
				<DropdownMenu.Item
					onclick={() => {
						if (messages[messageIndex].message.type === 'interactive') {
							messages[messageIndex].actions = actionsActions.createEventRegistrationAction(
								messages[messageIndex].message.interactive.action.buttons[buttonIndex].reply.id,
								messages[messageIndex].actions
							);
						}
					}}>Register to Event</DropdownMenu.Item
				>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
