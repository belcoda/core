<script lang="ts">
	import EventsForm from '../EventsForm.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.jolly_spare_mole_evoke()} />
<EventsForm isUpdate={false} />
