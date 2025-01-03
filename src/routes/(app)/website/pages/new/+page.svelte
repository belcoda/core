<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	export let data;
	import ContentCreateForm from '../../ContentCreateForm.svelte';
</script>

<PageHeader title={data.t.pages.website.pages.new()} />
<div class="mt-6">
	<ContentCreateForm isCreate={true} contentTypeSlug={'pages'} />
</div>
