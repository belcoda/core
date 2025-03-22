<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	export let data;
	import ContentCreateForm from '../../ContentCreateForm.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages';
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
	<ContentCreateForm isCreate={true} contentTypeSlug={'pages'} />
</div>
