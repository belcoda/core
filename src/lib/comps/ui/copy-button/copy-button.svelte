<script lang="ts">
	import Copy from 'lucide-svelte/icons/copy';
	import Check from 'lucide-svelte/icons/check';

	const {
		textToCopy,
		successMessage = 'Copied!',
		size = 14,
		className = ''
	} = $props<{
		textToCopy: string;
		successMessage?: string;
		size?: number;
		className?: string;
	}>();

	import { page } from '$app/stores';

	let isCopied = $state(false);

	function copyToClipboard() {
		navigator.clipboard.writeText(textToCopy);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}
</script>

<button
	class="ml-1 p-1 hover:bg-muted rounded-sm transition-colors duration-200 {isCopied
		? 'text-green-600'
		: ''} {className}"
	title={isCopied
		? $page.data.t.forms.actions.copied_to_clipboard()
		: $page.data.t.forms.buttons.copy_url_to_clipboard()}
	onclick={copyToClipboard}
>
	{#if isCopied}
		<div class="flex items-center gap-1">
			<Check {size} />
			<span class="text-xs font-medium">{successMessage}</span>
		</div>
	{:else}
		<Copy {size} />
	{/if}
</button>
