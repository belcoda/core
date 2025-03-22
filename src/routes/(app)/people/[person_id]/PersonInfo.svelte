<script lang="ts">
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	import type { Read } from '$lib/schema/people/people';
	const { person }: { person: Read } = $props();
	import { renderAddress } from '$lib/utils/text/address';
	import { Badge } from '$lib/comps/ui/badge';

	import Tags from '$lib/comps/widgets/tags/Tags.svelte';
	import PointPerson from '$lib/comps/widgets/point_person/PointPerson.svelte';

	import Check from 'lucide-svelte/icons/check';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Mail from 'lucide-svelte/icons/mail';
	import Phone from 'lucide-svelte/icons/phone';
	import Building from 'lucide-svelte/icons/building-2';
</script>

<div class="text-muted-foreground space-y-2 mt-3">
	{#if renderAddress(person, $page.data.t, $page.data.country).text.length > 0}
		<div class="flex items-center gap-1.5">
			<MapPin size={18} />
			<a href={renderAddress(person, $page.data.t, $page.data.instance.country).url} target="_blank"
				>{renderAddress(person, $page.data.t, $page.data.instance.country).text}</a
			>
		</div>
	{/if}

	{#if person.email}
		<div class="flex items-center gap-1.5">
			<Mail size={18} />
			<div>{person.email.email}</div>
			{#if person.email.subscribed}<Badge class="gap-1 bg-success-600 hover:bg-success-600"
					><Check size={12} />{m.quick_plain_warthog_heart()}</Badge
				>{/if}
		</div>
	{/if}

	{#if person.phone_number}
		<div class="flex items-center gap-1.5">
			<Phone size={18} />
			<div>{person.phone_number.phone_number}</div>
			{#if person.phone_number.subscribed}
				<Badge class="gap-1 bg-success-600 hover:bg-success-600"
					><Check size={12} />{m.quick_plain_warthog_heart()}</Badge
				>
			{/if}
		</div>
	{/if}

	{#if person.organization}
		<div class="flex items-center gap-1.5">
			<Building size={18} />
			{#if person.position}<div>{`$erson.position}, `}</div>{/if}
			<div>{person.organization}</div>
		</div>
	{/if}

	<div class="flex justify-between items-baseline flex-wrap gap-4">
		<Tags type="people" personOrEventId={person.id} />
		<PointPerson type="person" objectId={person.id} admin={person.point_person}
			>{#snippet header()}{/snippet}</PointPerson
		>
	</div>
</div>
