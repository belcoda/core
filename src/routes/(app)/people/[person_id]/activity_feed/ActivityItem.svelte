<script lang="ts">
	import { type List } from '$lib/schema/people/interactions';
	import { type Read as ReadPerson } from '$lib/schema/people/people';
	import { type Snippet } from 'svelte';
	import { page } from '$app/stores';
	import Avatar from '$lib/comps/ui/custom/avatar/avatar.svelte';
	type Props = {
		interaction: List['items'][number];
		activityMessage: string;
		displayUserAvatar?: boolean;
		person: ReadPerson;
		children?: Snippet;
		button?: Snippet;
		class?: string;
	};
	const {
		interaction,
		activityMessage,
		displayUserAvatar,
		person,
		children,
		button,
		class: className
	}: Props = $props();
</script>

<div class={`bg-white rounded-sm shadow-sm border pt-2 pb-3 px-4 ${className}`}>
	<div class="flex items-center gap-4 justify-between">
		<div class="flex items-center gap-4">
			<div>
				{#if displayUserAvatar === true}
					<Avatar profile_picture_url={null} full_name={person.full_name} />
				{:else}
					<Avatar
						profile_picture_url={interaction.admin.profile_picture_url}
						full_name={interaction.admin.full_name}
					/>
				{/if}
			</div>
			<div>
				<div class="font-medium tex text-foreground">{@html activityMessage}</div>
				<div class="text-xs text-muted-foreground">
					{$page.data.timeAgo.format(interaction.created_at)}
				</div>
			</div>
		</div>
		{#if button}
			<div>{@render button()}</div>
		{/if}
	</div>
	{#if children}{@render children()}{/if}
</div>
