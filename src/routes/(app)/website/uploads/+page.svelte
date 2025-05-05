<script lang="ts">
	const { data } = $props();
	import * as m from '$lib/paraglide/messages';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import RenderUpload from '$lib/comps/widgets/uploads/RenderUpload.svelte';
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	const flash = getFlash(page);

	async function deleteUpload(id: number) {
		if (!confirm(m.moving_acidic_crow_imagine())) return;
		try {
			const response = await fetch(`/api/v1/website/uploads/${id}`, {
				method: 'DELETE'
			});
			if (!response.ok) {
				throw new Error(m.keen_agent_shell_mop());
			}
			$flash = { type: 'success', message: m.dizzy_actual_elephant_evoke() };
			window.location.reload();
		} catch (error) {
			if (error instanceof Error) {
				$flash = { type: 'error', message: error.message };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
	}
</script>

<DataGrid
	items={data.uploads.items}
	count={data.uploads.count}
	title={m.teal_front_cobra_devour()}
	options={{
		contentGridClass:
			'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mt-4',
		showBottomSeparator: false,
		showTopSeparator: false,
		contentHighlightHover: false,
		filterKey: 'file_name',
		nothingFoundMessage: m.tasty_busy_crossbill_buzz()
	}}
>
	{#snippet headerButton()}
		<Button href="/website/uploads/new">{m.mild_fine_bulldog_zip()}</Button>
	{/snippet}
	{#snippet content(item: (typeof data.uploads.items)[0])}
		<RenderUpload
			upload={item}
			showCopyButton={true}
			showDeleteButton={true}
			onDelete={deleteUpload}
		/>
	{/snippet}
</DataGrid>
