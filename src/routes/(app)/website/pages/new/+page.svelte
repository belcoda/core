<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	export let data;
	import ContentCreateForm from '../../ContentCreateForm.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.due_sea_finch_beam()} />
<div class="mt-6">
	<ContentCreateForm isCreate={true} contentTypeSlug={'pages'} />
</div>
