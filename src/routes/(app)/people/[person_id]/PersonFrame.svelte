<script lang="ts">
	import { page } from '$app/stores';
	import type { Read } from '$lib/schema/people/people';
	import type { Snippet } from 'svelte';
	const { person }: { person: Read; children: Snippet } = $props();
	import H3 from '$lib/comps/typography/H3.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Avatar from '$lib/comps/ui/custom/avatar/avatar.svelte';
	import { renderAddress } from '$lib/utils/text/address';

	import Tags from '$lib/comps/widgets/tags/Tags.svelte';
	import PointPerson from '$lib/comps/widgets/point_person/PointPerson.svelte';
	import Building from 'lucide-svelte/icons/building-2';
	import Briefcase from 'lucide-svelte/icons/briefcase';
	import CheckCircle from 'lucide-svelte/icons/circle-check';
</script>

<div class="w-full grid cols-1 space-y-2 mt-3">
	<Avatar
		class="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
		textClass="md:text-xl md:font-medium lg:text-2xl lg:font-bold"
		profile_picture_url={null}
		full_name={person.full_name}
	/>
	<H3>{person.full_name}</H3>

	{#if person.position}
		<div class="flex items-center gap-1.5">
			<Briefcase size={18} class="text-foreground" />
			<div class="text-muted-foreground">{person.position}</div>
		</div>
	{/if}

	{#if person.organization}
		<div class="flex items-center gap-1.5">
			<Building size={18} class="text-foreground" />
			<div class="text-muted-foreground">{person.organization}</div>
		</div>
	{/if}
	<Separator />
	<div class="grid grid-cols-1 gap-4">
		{#if renderAddress(person, $page.data.t, $page.data.instance.country).text.length > 0}
			<div>
				<div class="section-title">Address</div>
				<a
					class="font-medium text-foreground"
					href={renderAddress(person, $page.data.t, $page.data.instance.country).url}
					target="_blank">{renderAddress(person, $page.data.t, $page.data.instance.country).text}</a
				>
			</div>
		{/if}

		{#if person.email}
			<div>
				<div class="section-title">Email</div>
				<div class="flex items-center gap-1.5">
					<div>
						<a href="mailto:{person.email.email}" class="font-medium text-foreground">
							{person.email.email}
						</a>
					</div>
					{#if person.email.subscribed}
						<CheckCircle size={20} class="text-success-600" />
					{/if}
				</div>
			</div>
		{/if}

		{#if person.phone_number}
			<div>
				<div class="section-title">Phone Number</div>
				<div class="flex items-center gap-1.5">
					<div>{person.phone_number.phone_number}</div>
					{#if person.phone_number.subscribed}
						<CheckCircle size={20} class="text-success-600" />
					{/if}
				</div>
			</div>
		{/if}
		<div>
			<div class="section-title mb-2">Tags</div>
			<Tags type="people" personOrEventId={person.id} addTagButtonFirst={true} />
		</div>

		<div>
			<div class="section-title mb-2">Point person</div>
			<PointPerson type="person" objectId={person.id} admin={person.point_person}
				>{#snippet header()}{/snippet}</PointPerson
			>
		</div>
	</div>
	<Separator />

	<div class="flex"><Button href="/people/{person.id}/edit" variant="outline">Edit</Button></div>
</div>

<style lang="postcss">
	.section-title {
		@apply font-light uppercase tracking-wider text-sm text-muted-foreground;
	}
</style>
