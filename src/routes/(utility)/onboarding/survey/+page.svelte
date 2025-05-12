<script lang="ts">
	const { data: pageData } = $props();
	import createForm from './form.svelte';
	import TextInput from './TextInput.svelte';
	import CountrySelect from './CountrySelect.svelte';
	import SuperDebug from 'sveltekit-superforms';
	const { form, data, warnBeforeDiscard } = createForm({
		onSubmit: async (formData) => {
			// Handle form submission
			console.log('Form submitted:', formData);
		}
	});
</script>

<form method="POST" use:form.enhance class="grid grid-cols-1 gap-3">
	{@render H1('Onboarding survey')}
	<p>
		Before we get started, I need to ask a few questions in order to set up your organization on the
		Belcoda platform.
	</p>
	<p>Please read the questions carefully and provide answers to all the ones you can.</p>
	{@render H2('A little bit about you')}
	<p>
		These questions are about you, the person who is setting up this organization on Belcoda. You
		will be the first user for your organization, but you can add other users later.
	</p>
	<TextInput
		superform={form}
		field="ownerName"
		label="Your full name"
		description="This is the name that will be displayed on your profile."
	/>
	<TextInput
		superform={form}
		type="email"
		field="whatsAppNumber"
		label="WhatsApp number"
		description="What's the best phone number to reach you on WhatsApp? Please use the full international format, including the country code. For example, +15551234567."
	/>

	{@render H2('About your organization')}
	<p>
		We need a bit of information about your organization in order to get you set up with the correct
		settings.
	</p>
	<TextInput
		class="mb-3"
		superform={form}
		type="text"
		field="instanceName"
		label="Your organization's name"
	/>
	<TextInput
		superform={form}
		type="text"
		field="instanceSlug"
		label="A short, URL-friendly version of your organization's name"
		description="This will be part of the domain name for your organization's event and other pages hosted on Belcoda. No spaces or special characters are allowed. Only lowercase letters from the English alphabet, numbers and underscores (_)"
	/>
	<CountrySelect
		superform={form}
		field="country"
		label="Country"
		description="The country in which your organization is based. If you operate in multiple countries, then choose the country that you yourself reside in."
	/>
	{@render H2('A quick question about email')}
	<p>
		By default, email sent via Belcoda (for example, event invitations or reminder messages) will be
		appear from:
	</p>
	<p>
		<code
			>{$data.instanceName || 'Instance Name'}
			{`<${$data.instanceSlug || 'instance_slug'}@belcoda.com>`}</code
		>
	</p>
	<p>
		When someone replies to one of those emails, which email address do you want to receive the
		replies at? It should be an email address you check regularly.
	</p>
	<TextInput
		superform={form}
		type="email"
		field="replyToEmail"
		label="Default reply-to email"
		description="Which email address should we direct incoming email messages to? Don't worry, you can change all these settings later."
	/>
	{@render H2('Where else is your organization available online?')}
	<p>
		If you don't have an account on all these platforms, it's totally fine to leave these blank.
	</p>
	<TextInput
		superform={form}
		type="text"
		field="website"
		label="Website"
		description="The URL of your organization's website (leave blank if you don't have one)."
	/>
	<TextInput
		superform={form}
		type="text"
		field="facebook"
		label="Facebook"
		description="The URL of your organization's Facebook page"
	/>
	<TextInput
		superform={form}
		type="text"
		field="twitter"
		label="Twitter/X"
		description="Your organization's Twitter/X account"
	/>
	<TextInput
		superform={form}
		type="text"
		field="instagram"
		label="Instagram"
		description="Your organization's Instagram account"
	/>
	<div>
		<button
			type="submit"
			class="w-full mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Continue
		</button>
	</div>
	<SuperDebug data={$data} />
</form>

{#snippet H1(text: string)}
	<h1 class="text-3xl lg:text-4xl font-extrabold text-gray-800">{text}</h1>
{/snippet}

{#snippet H2(text: string)}
	<h2 class="text-2xl lg:text-3xl font-extrabold text-gray-800 mt-4">{text}</h2>
{/snippet}
