<script lang="ts">
	import { page } from '$app/stores';
	const { person_id, eventIsPast }: { person_id: number; eventIsPast: boolean } = $props();
	import Button from '$lib/comps/ui/button/button.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import * as Select from '$lib/comps/ui/select';
	import { Checkbox } from '$lib/comps/ui/checkbox';
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
	let status = $state(attendanceStatus[0]);
	const label = $derived(attendanceStatusValues[status] || m.cuddly_trick_chipmunk_charm());
	let sendNotifications: boolean = $state(true);
</script>

<form method="post">
	<div class="flex items-center gap-2">
		<input type="hidden" name="person_id" value={person_id} />
		<input type="hidden" name="send_notifications" value={sendNotifications} />
		<input type="hidden" name="status" value={status} />
		<Select.Root type="single" bind:value={status}>
			<Label>{m.actual_petty_bee_snip()}</Label>
			<Checkbox bind:checked={sendNotifications} />
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
		<Button variant="outline" type="submit">{m.empty_warm_squirrel_chop()}</Button>
	</div>
</form>
