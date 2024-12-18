<script lang="ts">
	import { page } from '$app/stores';
	const attendanceStatus: ['registered', 'attended', 'cancelled', 'noshow'] = [
		'registered',
		'attended',
		'cancelled',
		'noshow'
	];
	let {
		personId,
		sendNotifications = $bindable(),
		status = $bindable()
	}: {
		personId: number;
		sendNotifications: boolean;
		status: (typeof attendanceStatus)[number];
	} = $props();
	import Button from '$lib/comps/ui/button/button.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import * as Select from '$lib/comps/ui/select';
	import { Checkbox } from '$lib/comps/ui/checkbox';

	const label = $derived($page.data.t.events.status[status]?.title() || 'Select status');
</script>

<form method="post">
	<div class="flex items-center gap-2">
		<input type="hidden" name="person_id" value={personId} />
		<Label>{$page.data.t.forms.fields.events.attendees.send_notifications.label()}</Label>
		<Checkbox bind:checked={sendNotifications} />
		<input name="send_notifications" value={sendNotifications} hidden />
		<input type="hidden" name="status" value={status} />
		<Select.Root type="single" bind:value={status}>
			<Select.Trigger class="w-[180px]">
				{label}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each attendanceStatus as singleStatus}
						<Select.Item value={singleStatus}
							>{$page.data.t.events.status[singleStatus]?.title()}</Select.Item
						>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Button variant="outline" type="submit">{$page.data.t.forms.buttons.update()}</Button>
	</div>
</form>
