<script lang="ts">
	import EventsForm from '../../EventsForm.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.yummy_frail_dove_pick()}>
	{#snippet button()}
		<div class="flex items-center gap-2">
			<Button variant="outline" href={`/events/${$page.params.event_id}/edit/advanced`}
				>{m.warm_jumpy_poodle_find()}</Button
			>
			<Button href="/events/{$page.params.event_id}/edit/notifications" variant="outline"
				>Manage notifications</Button
			>
			<Button href="/events/{$page.params.event_id}">Back</Button>
		</div>
	{/snippet}
</PageHeader>
<EventsForm isUpdate={true} />
