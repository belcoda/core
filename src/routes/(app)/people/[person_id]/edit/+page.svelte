<script lang="ts">
	export let data;
	import PersonForm from '../../PersonForm.svelte';
	import { update } from '$lib/schema/people/people';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.such_spicy_gopher_roam()} />
<PersonForm superform={data.form} schema={update} />
