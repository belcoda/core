<script lang="ts">
	const { data } = $props();
	import AdvancedContentAuthoring from '$lib/comps/forms/AdvancedContentAuthoring.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={data.event.name} separator={false}>
	{#snippet button()}
		<div class="flex items-center gap-1">
			<Button href={`/events/${data.event.id}/edit`} variant="outline"
				>{m.super_broad_gopher_hurl()}</Button
			>
		</div>
	{/snippet}
</PageHeader>
<div class="mt-8">
	<AdvancedContentAuthoring type={'event'} actionUrl={`/events/${data.event.id}/edit`} />
</div>
