<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	const attendanceStatus: ['registered', 'attended', 'cancelled', 'noshow'] = [
		'registered',
		'attended',
		'cancelled',
		'noshow'
	];
	const attendanceStatusValues = {
		registered: m.curly_safe_kangaroo_launch(),
		attended: m.gaudy_brave_boar_spark(),
		cancelled: m.heroic_swift_skate_splash(),
		noshow: m.minor_major_antelope_feast()
	};
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

	const label = $derived(attendanceStatusValues[status] || m.still_loved_butterfly_thrive());
</script>

<form method="post">
	<div class="flex items-center gap-2">
		<input type="hidden" name="person_id" value={personId} />
		<Label>{m.dirty_wacky_martin_type()}</Label>
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
						<Select.Item value={singleStatus}>{attendanceStatusValues[singleStatus]}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Button variant="outline" type="submit">{m.frail_upper_koala_hurl()}</Button>
	</div>
</form>
