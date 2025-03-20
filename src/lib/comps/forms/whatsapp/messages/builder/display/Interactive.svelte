<script lang="ts">
	import Reply from 'lucide-svelte/icons/reply';
	import { type Read, type List } from '$lib/schema/communications/whatsapp/messages';
	const { messages, index, selected }: { messages: Read[]; index: number; selected: boolean } =
		$props();
</script>

{#if messages[index].message.type === 'interactive'}
	{#if messages[index].message.interactive.type === 'button'}
		{#each messages[index].message.interactive.action.buttons as button, i}
			<div
				class:text-blue-500={!selected}
				class:text-white={selected}
				class:bg-blue-500={selected}
				class:bg-none={!selected}
				class="flex items-center gap-1 border-t justify-center py-1"
			>
				<Reply size={16} />
				<div>{button.reply.title}</div>
			</div>
		{/each}
	{/if}
{/if}
