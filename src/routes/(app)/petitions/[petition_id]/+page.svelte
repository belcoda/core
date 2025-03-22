<script lang="ts">
	const { data } = $props();
	import * as m from '$lib/paraglide/messages';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import PersonBadge from '$lib/comps/widgets/PersonBadge.svelte';

	import Tags from '$lib/comps/widgets/tags/Tags.svelte';
	import PointPerson from '$lib/comps/widgets/point_person/PointPerson.svelte';
	import PersonDropdown from '$lib/comps/widgets/person/PersonDropdown.svelte';
	import { type _ListWithSearch } from '$lib/schema/people/people';
	import Link from 'lucide-svelte/icons/link';
	import CopyButton from '$lib/comps/ui/copy-button/copy-button.svelte';
	import { PUBLIC_HOST } from '$env/static/public';

	const signatureIds = $derived(data.signatures.items.map((signature) => signature.person_id));
	import { page } from '$app/stores';
	import { getFlash } from 'sveltekit-flash-message';
	import { invalidateAll } from '$app/navigation';

	let flash = getFlash(page);

	const url = new URL(PUBLIC_HOST);
	const previewUrl = `${url.protocol}//${$page.data.instance.slug}.${url.host}/petitions/${data.petition.slug}`;

	async function addPerson(person: _ListWithSearch['items'][number]) {
		try {
			const res = await fetch(`/api/v1/petitions/${data.petition.id}/signatures`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ person_id: person.id })
			});
			if (res.ok) {
				$flash = { type: 'success', message: m.zesty_patient_butterfly_blink() };
				await invalidateAll();
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		} catch (err) {
			if (err instanceof Error) {
				$flash = { type: 'error', message: err.message };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
	}
	import Plus from 'lucide-svelte/icons/plus';
</script>

<PageHeader title={data.petition.name} separator={false}>
	{#snippet button()}
		<div class="flex items-center gap-1">
			<Button variant="outline" target="_blank" href="/petitions/{data.petition.id}/preview"
				>{m.alive_silly_antelope_build()}</Button
			>
			<Button href="/petitions/{data.petition.id}/edit">{m.giant_misty_shrimp_stop()}</Button>
		</div>
	{/snippet}
</PageHeader>
<div class="text-muted-foreground space-y-2 mt-3">
	<div class="flex items-center gap-1.5">
		<Link size={16} />
		<span class="text-muted-foreground text-sm">
			<span class="text-foreground">{previewUrl}</span>
		</span>
		<CopyButton textToCopy={previewUrl} />
	</div>
	<div class="flex justify-between items-baseline flex-wrap gap-4">
		<Tags type="events" personOrEventId={data.petition.id} />
		<PointPerson type="petition" objectId={data.petition.id} admin={data.petition.point_person}
			>{#snippet header()}{/snippet}</PointPerson
		>
	</div>
</div>
<div class="mt-12">
	<DataGrid
		title={m.safe_true_goat_strive()}
		items={data.signatures.items}
		count={data.signatures.count}
		options={{ showFilter: false }}
	>
		{#snippet headerButton()}
			<PersonDropdown selectedPersonIds={signatureIds} onAddPerson={addPerson}>
				<Plus size={14} />
				{m.broad_proud_anteater_dig()}
			</PersonDropdown>
		{/snippet}
		{#snippet content(signature: (typeof data.signatures.items)[0])}
			<div class="flex items-center justify-between gap-4">
				<PersonBadge person={signature} />
			</div>
		{/snippet}
	</DataGrid>
</div>
