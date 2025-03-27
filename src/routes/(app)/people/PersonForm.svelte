<script lang="ts">
	import { page } from '$app/stores';
	import { type SuperValidated } from 'sveltekit-superforms';
	import * as m from '$lib/paraglide/messages';
	import {
		DEFAULT_EMAIL,
		generateDefaultPhoneNumber,
		type Email,
		type PhoneNumber
	} from '$lib/schema/people/channels/channels';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import {
		Input,
		Button,
		HTMLDate as DateElement,
		Error,
		HTML,
		Checkbox,
		Textarea,
		Grid,
		Switch,
		Code,
		Debug,
		superForm,
		valibotClient,
		type Infer
	} from '$lib/comps/ui/forms';
	import { create, update } from '$lib/schema/people/people';
	type Props = {
		superform: SuperValidated<Infer<typeof create | typeof update>>;
		schema: typeof create | typeof update;
	};
	const { superform, schema }: Props = $props();

	const form = superForm(superform, {
		validators: valibotClient(schema),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	import X from 'lucide-svelte/icons/x';
	import PersonName from '$lib/comps/forms/PersonName.svelte';
	import Address from '$lib/comps/forms/Address.svelte';
	import { DEFAULT_COUNTRY } from '$lib/i18n';
	let storedPhoneNumber: PhoneNumber | null | undefined = null;
	let storedEmail: Email | null | undefined = null;
</script>

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<PersonName
			country={$page.data.instance.country}
			{form}
			given_name="given_name"
			given_name_alt="given_name_alt"
			family_name="family_name"
			family_name_alt="family_name_alt"
			preferred_name="preferred_name"
			full_name="full_name"
		/>

		<Grid cols={2} class="items-center">
			<div class:border={$formData.email} class="rounded">
				{#if $formData.email}
					<div class="flex justify-end">
						<Button
							variant="ghost"
							class="mt-0"
							size="icon"
							onclick={() => {
								storedEmail = $formData.email;
								$formData.email = null;
							}}><X size={16} /></Button
						>
					</div>
					<Grid cols={1} class="gap-y-1 px-4 pb-4">
						<Input
							type="email"
							{form}
							name="email.email"
							bind:value={$formData.email.email as string}
							label={m.stock_tame_monkey_dine()}
						/>
						<div class="flex justify-end">
							<Checkbox
								{form}
								name="email.subscribed"
								bind:checked={$formData.email.subscribed as boolean}
								label={m.day_kind_weasel_cook()}
							/>
						</div>
					</Grid>
				{:else}
					<Button
						variant="outline"
						class="mt-0"
						onclick={() => ($formData.email = storedEmail ? storedEmail : DEFAULT_EMAIL)}
						>{m.aware_long_starfish_buy()}</Button
					>
				{/if}
			</div>

			<div class:border={$formData.phone_number} class="rounded">
				{#if $formData.phone_number}
					<div class="flex justify-end">
						<Button
							variant="ghost"
							class="mt-0"
							size="icon"
							onclick={() => {
								storedPhoneNumber = $formData.phone_number;
								$formData.phone_number = null;
							}}><X size={16} /></Button
						>
					</div>
					<Grid cols={1} class="gap-y-1 px-4 pb-4">
						<Input
							type="text"
							{form}
							name="phone_number.phone_number"
							bind:value={$formData.phone_number.phone_number as string}
							label={m.sleek_frail_parakeet_buzz()}
						/>
						<div class="flex justify-end">
							<Checkbox
								{form}
								name="phone_number.subscribed"
								bind:checked={$formData.phone_number.subscribed as boolean}
								label={m.day_kind_weasel_cook()}
							/>
						</div>
					</Grid>
				{:else}
					<Button
						variant="outline"
						class="mt-0"
						onclick={() =>
							($formData.phone_number = storedPhoneNumber
								? storedPhoneNumber
								: generateDefaultPhoneNumber($formData.country || DEFAULT_COUNTRY))}
						>{m.noble_low_kitten_cherish()}</Button
					>
				{/if}
			</div>
		</Grid>

		<Separator class="my-6" />

		<Grid cols={2} class="items-center">
			<Input
				type="text"
				{form}
				name="organization"
				bind:value={$formData.organization as string}
				label={m.solid_many_giraffe_snip()}
			/>
			<Input
				type="text"
				{form}
				name="position"
				bind:value={$formData.position as string}
				label={m.noisy_tasty_moth_zoom()}
			/>
		</Grid>

		<Separator class="my-6" />

		<Address
			{form}
			address_line_1={'address_line_1'}
			address_line_2={'address_line_2'}
			address_line_3={'address_line_3'}
			address_line_4={'address_line_4'}
			locality={'locality'}
			state={'state'}
			postcode={'postcode'}
			country={'country'}
			onCountryChange={(country) => {
				if ($formData.phone_number) {
					$formData.phone_number.country = country;
				}
			}}
		/>

		<Separator class="my-6" />
		<Grid cols={2}>
			<DateElement
				{form}
				name="dob"
				bind:value={$formData.dob as Date}
				label={m.slow_factual_wolf_find()}
			/>
		</Grid>

		<Button type="submit"></Button>
		<Debug data={$formData} />
	</Grid>
</form>
