<script lang="ts">
	export let data;
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';

	import EditMessageForm from '$lib/comps/forms/email/EmailEdit.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.ideal_fuzzy_grebe_cut()} />
<EditMessageForm
	mode="create"
	formObject={data.form}
	actionUrl={`/communications/email/messages/new`}
/>
