<script lang="ts">
	const { data } = $props();
	import AdvancedContentAuthoring from '$lib/comps/forms/AdvancedContentAuthoring.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
</script>

<PageHeader title={data.content.name} separator={false}>
	{#snippet button()}
		<div class="flex items-center gap-1">
			<Button href={`/website/posts/${data.content.id}`} variant="outline"
				>{data.t.forms.buttons.back()}</Button
			>
		</div>
	{/snippet}
</PageHeader>
<div class="mt-8">
	<AdvancedContentAuthoring type={'content'} actionUrl={`/website/posts/${data.content.id}`} />
</div>
