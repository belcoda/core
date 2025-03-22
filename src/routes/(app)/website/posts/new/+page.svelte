<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	export let data;
	import ContentCreateForm from '../../ContentCreateForm.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.real_close_toad_buzz()} />
<div class="mt-6">
	<ContentCreateForm isCreate={true} contentTypeSlug={'posts'} />
</div>
