<script lang="ts">
	import { type List } from '$lib/schema/website/uploads';
	import { type Snippet } from 'svelte';
	const {
		upload,
		showCopyButton = false,
		showDeleteButton = false,
		onDelete = () => {},
		children
	}: {
		upload: List['items'][number];
		showCopyButton: boolean;
		showDeleteButton?: boolean;
		onDelete?: (id: number) => void;
		children?: Snippet;
	} = $props();
	import { humanReadableFileSize } from '$lib/utils/text/file_size';
	import Button from '$lib/comps/ui/button/button.svelte';
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	import Badge from '$lib/comps/ui/badge/badge.svelte';
	const flash = getFlash(page);
	import * as m from '$lib/paraglide/messages';
	import { Trash2Icon } from 'lucide-svelte';

	function copy() {
		navigator.clipboard.writeText(upload.url);
		$flash = { type: 'success', message: m.bright_many_mare_promise() };
	}
</script>

<div class="border rounded">
	{#if upload.mime_type.includes('image')}
		<img src={upload.url} alt={upload.file_name} />
	{/if}
	<div class="p-2">
		<div class="font-medium my-1">{upload.file_name}</div>
		<div class="font-light text-xs text-muted-foreground flex justify-between items-center mt-2">
			<div><Badge variant="secondary">{upload.mime_type}</Badge></div>
			<div><Badge variant="secondary">{humanReadableFileSize(upload.size, true)}</Badge></div>
		</div>
		{#if children}{@render children()}{/if}
		<div class="flex justify-center mt-3 gap-2">
			{#if showCopyButton}
				<Button variant="outline" size="sm" onclick={copy}>{m.loud_spicy_wombat_reside()}</Button>
			{/if}
			{#if showDeleteButton}
				<Button
					variant="destructive"
					size="sm"
					onclick={() => onDelete(upload.id)}
					title={m.wide_major_pig_swim()}
				>
					<Trash2Icon class="w-4 h-4" />
				</Button>
			{/if}
		</div>
	</div>
</div>
