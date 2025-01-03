<script lang="ts">
	import PetitionsForm from '../../PetitionsForm.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	export let data;
	import { page } from '$app/stores';
</script>

<PageHeader title={data.t.pages.actions.petitions.edit()}>
	{#snippet button()}
		<div class="flex items-center gap-2">
			<Button href="/petitions/{$page.params.petition_id}/edit/notifications" variant="outline"
				>{$page.data.t.forms.buttons.notification_settings()}</Button
			>
			<Button href="/petitions/{$page.params.petition_id}/edit/advanced" variant="outline"
				>{$page.data.t.forms.buttons.advanced_settings()}</Button
			>
			<Button href="/petitions/{$page.params.petition_id}"
				>{$page.data.t.forms.buttons.back()}</Button
			>
		</div>
	{/snippet}
</PageHeader>
<PetitionsForm isUpdate={true} />
