<script lang="ts">
	import PetitionsForm from '../../PetitionsForm.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.candid_trite_capybara_trust()}>
	{#snippet button()}
		<div class="flex items-center gap-2">
			<Button href="/petitions/{$page.params.petition_id}/edit/notifications" variant="outline"
				>{m.warm_ornate_cat_enrich()}</Button
			>
			<Button href="/petitions/{$page.params.petition_id}/edit/advanced" variant="outline"
				>{m.sharp_same_anaconda_laugh()}</Button
			>
			<Button href="/petitions/{$page.params.petition_id}">{m.super_broad_gopher_hurl()}</Button>
		</div>
	{/snippet}
</PageHeader>
<PetitionsForm isUpdate={true} />
