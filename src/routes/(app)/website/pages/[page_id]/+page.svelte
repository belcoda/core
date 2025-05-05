<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	export let data;
	import ContentCreateForm from '../../ContentCreateForm.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	import { goto } from '$app/navigation';
	const flash = getFlash(page);

	async function deletePage() {
		if (!confirm(m.moving_acidic_crow_imagine())) {
			return;
		}
		try {
			const response = await fetch(
				`/api/v1/website/content_types/${data.page.content_type_id}/content/${data.page.id}`,
				{
					method: 'DELETE'
				}
			);
			if (!response.ok) {
				throw new Error(m.keen_agent_shell_mop());
			}
			$flash = { type: 'success', message: m.dizzy_actual_elephant_evoke() };
			goto('/website/pages');
		} catch (error) {
			if (error instanceof Error) {
				$flash = { type: 'error', message: error.message };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
	}
</script>

<PageHeader title={m.only_sad_anteater_roar()}>
	{#snippet button()}
		<div class="flex justify-end gap-2 items-center">
			<Button variant="outline" href="/website/pages/{data.page.id}/preview" target="_blank"
				>{m.alive_silly_antelope_build()}</Button
			>
			<Button variant="outline" href="/website/pages/{data.page.id}/advanced"
				>{m.elegant_cuddly_horse_boil()}</Button
			>
		</div>
	{/snippet}
</PageHeader>
<div class="mt-6">
	<ContentCreateForm
		isCreate={true}
		contentTypeSlug={'pages'}
		showDeleteButton={true}
		onDelete={deletePage}
	/>
</div>
