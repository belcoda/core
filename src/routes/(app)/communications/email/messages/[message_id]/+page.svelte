<script lang="ts">
	const { data } = $props();
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';

	import EditMessageForm from '$lib/comps/forms/email/EmailEdit.svelte';
	import EmailSends from '$lib/comps/forms/email/EmailSends.svelte';
	import * as m from '$lib/paraglide/messages';

	let loading = $state(false);
	const disabled = $derived(data.sends.count > 0);
</script>

<PageHeader title={m.ideal_fuzzy_grebe_cut()} />
<div class="flex gap-4 lg:gap-8">
	<div class="w-full lg:w-2/3 pt-6 lg:pt-8">
		<EditMessageForm
			mode="update"
			{disabled}
			messageId={data.message.id}
			formObject={data.form}
			actionUrl={`/communications/email/messages/${data.message.id}?/update`}
		/>
	</div>

	<div class="w-full lg:w-1/3 pt-6 lg:pt-8">
		<EmailSends message={data.message} sends={data.sends} bind:loading />
	</div>
</div>
