<script lang="ts">
	const { data } = $props();
	import { superForm, valibotClient, Debug } from '$lib/comps/ui/forms';
	import { Grid, Error, Input, Button } from '$lib/comps/ui/forms';
	import { create } from '$lib/schema/communications/email/from_signatures';
	const form = superForm(data.form, {
		validators: valibotClient(create)
	});
	const { form: formData, enhance, message } = form;
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={'New email from signature'}>
	{#snippet button()}<Button href="/settings/email/from_signatures" variant="outline" size="sm">
			{'Back'}
		</Button>
	{/snippet}
</PageHeader>
<form use:enhance method="POST" class="mt-6">
	<Grid cols={1}>
		<Error error={$message} />
		{#if $formData.name && $formData.email}
			<div class="flex justify-end items-center gap-2">
				<div class="text-sm text-gray-500">Your email address will appear as</div>
				<div class="text-sm text-gray-900 font-semibold">
					<code>"{`${$formData.name} <${$formData.email}>`}"</code>
				</div>
			</div>
		{/if}
		<Input
			{form}
			label={m.extra_wild_earthworm_commend()}
			bind:value={$formData.name as string}
			name="name"
		/>
		<Input
			{form}
			type="email"
			label={'Email address'}
			bind:value={$formData.email as string}
			name="email"
		/>

		<Input
			{form}
			type="text"
			label={'Return path domain'}
			bind:value={$formData.return_path_domain as string}
			name="return_path_domain"
		/>

		<div class="-mt-4 text-sm text-gray-500">
			If you're not sure what this does, just leave it blank. You will still be able to send emails
			from this address. For more information, visit the <a
				href="https://postmarkapp.com/support/article/910-how-do-i-add-a-custom-return-path"
				class="text-blue-500 hover:underline">documentation</a
			>.
		</div>
		<div class="flex justify-end">
			<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		</div>
		<Debug data={$formData} />
	</Grid>
</form>
