<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	export let data;
	import ContentCreateForm from '../../ContentCreateForm.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
</script>

<PageHeader title={data.t.pages.website.posts.edit()}>
	{#snippet button()}
		<div class="flex justify-end gap-2 items-center">
			<Button variant="outline" href="/website/posts/{data.post.id}/preview" target="_blank"
				>{data.t.forms.buttons.preview()}</Button
			>
			<Button variant="outline" href="/website/posts/{data.post.id}/advanced"
				>{data.t.forms.buttons.advanced_settings()}</Button
			>
		</div>
	{/snippet}
</PageHeader>
<div class="mt-6">
	<ContentCreateForm isCreate={true} contentTypeSlug={'posts'} />
</div>
