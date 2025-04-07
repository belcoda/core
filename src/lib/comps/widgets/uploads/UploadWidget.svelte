<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, type Snippet } from 'svelte';
	import { getFlash } from 'sveltekit-flash-message';
	const flash = getFlash(page);

	import { type List, type Read } from '$lib/schema/website/uploads';
	import FileUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import RenderUpload from './RenderUpload.svelte';
	import Input from '$lib/comps/ui/input/input.svelte';
	import Error from '$lib/comps/ui/form/controls/Error.svelte';
	import H3 from '$lib/comps/typography/H3.svelte';
	import X from 'lucide-svelte/icons/x';

	import { load, loadSingle, upload as handleUpload } from './actions';
	import { debounce } from '$lib/utils';
	import Separator from '$lib/comps/ui/separator/separator.svelte';

	import * as m from '$lib/paraglide/messages';

	type Props = {
		onselected?: (upload: Read | null) => void;
		upload_id?: number | null;
		label?: string;
	};

	let { onselected, upload_id = $bindable(), label = m.white_mellow_dog_fear() }: Props = $props();

	let filter: string | null = $state(null);
	let list: List = $state({ items: [], count: 0 });
	let upload: Read | null = $state(null);
	let loading = $state(false);
	async function reload() {
		loading = true;
		list = await load(filter);
		loading = false;
	}
	onMount(async () => {
		if (upload_id) {
			loading = true;
			const uploadToLoad = await loadSingle(upload_id);
			upload = uploadToLoad;
			upload_id = uploadToLoad.id;
			loading = false;
		} else {
			await reload();
		}
	});
</script>

{#if upload}
	<div class="flex justify-center">
		<div class="relative">
			<RenderUpload {upload} showCopyButton={false} />
			<div class="absolute right-2 top-2">
				<Button
					variant="secondary"
					class="opacity-50"
					onclick={async () => {
						upload = null;
						upload_id = null;
						onselected && onselected(null);
						await reload();
					}}><X size={16} /></Button
				>
			</div>
		</div>
	</div>
{:else}
	<div>
		<H3 class="mb-4">{label}</H3>
		<FileUpload
			class="border-dashed bg-white"
			onUpload={async (file) => {
				try {
					const uploaded = await handleUpload(file, $page.data.t);
					upload = uploaded;
					upload_id = uploaded.id;
					onselected && onselected(uploaded);
					$flash = { type: 'success', message: m.flat_sleek_millipede_agree() };
					await reload();
				} catch (err) {
					if (err instanceof Error) {
						$flash = { type: 'error', message: err };
					} else {
						$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
					}
				}
			}}
		/>

		<Separator class="my-4" />

		<Input
			placeholder={m.proud_kind_sloth_feel()}
			bind:value={filter}
			oninput={debounce(reload, 400)}
		/>

		{#if list.count > 0}
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mt-4"
			>
				{#each list.items as item}
					<RenderUpload upload={item} showCopyButton={false}>
						<div class="flex justify-center">
							<Button
								class="mt-2"
								onclick={() => {
									upload = item;
									upload_id = item.id;
									onselected && onselected(item);
								}}>{m.stale_fresh_shad_hurl()}</Button
							>
						</div>
					</RenderUpload>
				{/each}
			</div>
		{/if}
	</div>
{/if}
