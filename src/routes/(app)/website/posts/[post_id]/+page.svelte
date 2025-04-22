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

	async function deletePost() {
		if (!confirm(m.moving_acidic_crow_imagine())) {
			return;
		}
		try {
			const response = await fetch(
				`/api/v1/website/content_types/${data.post.content_type_id}/content/${data.post.id}`,
				{
					method: 'DELETE'
				}
			);
			if (!response.ok) {
				throw new Error(m.keen_agent_shell_mop());
			}
			$flash = { type: 'success', message: m.dizzy_actual_elephant_evoke() };
			goto('/website/posts');
		} catch (error) {
			if (error instanceof Error) {
				$flash = { type: 'error', message: error.message };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
	}
</script>

<PageHeader title={m.fluffy_lazy_cougar_arrive()}>
	{#snippet button()}
		<div class="flex justify-end gap-2 items-center">
			<Button variant="outline" href="/website/posts/{data.post.id}/preview" target="_blank"
				>{m.alive_silly_antelope_build()}</Button
			>
			<Button variant="outline" href="/website/posts/{data.post.id}/advanced"
				>{m.close_pretty_kudu_grow()}</Button
			>
		</div>
	{/snippet}
</PageHeader>
<div class="mt-6">
	<ContentCreateForm
		isCreate={true}
		contentTypeSlug={'posts'}
		showDeleteButton={true}
		onDelete={deletePost}
	/>
</div>
