<script lang="ts">
	export let data;
	import PersonForm from '../PersonForm.svelte';
	import { create } from '$lib/schema/people/people';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.late_chunky_marlin_fry()} />

<PersonForm superform={data.form} schema={create} />
