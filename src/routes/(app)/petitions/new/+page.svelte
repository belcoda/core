<script lang="ts">
	import PetitionsForm from '../PetitionsForm.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={'New petition'} />
<PetitionsForm isUpdate={false} />
