<script lang="ts">
	import EventsForm from '../../EventsForm.svelte';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	export let data;
	import { page } from '$app/stores';
</script>

<PageHeader title={data.t.pages.events.edit_event()}>
	{#snippet button()}
		<div class="flex items-center gap-2">
			<Button variant="outline" href={`/events/${$page.params.event_id}/edit/advanced`}
				>{$page.data.t.forms.fields.events.advanced_settings.label()}</Button
			>
			<Button href="/events/{$page.params.event_id}/edit/notifications" variant="outline"
				>Manage notifications</Button
			>
			<Button href="/events/{$page.params.event_id}">Back</Button>
		</div>
	{/snippet}
</PageHeader>
<EventsForm isUpdate={true} />
