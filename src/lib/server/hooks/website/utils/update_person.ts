import { update, type Read } from '$lib/schema/people/people';
import { eventSignup, type EventSignup } from '$lib/schema/events/events';
import { petitionSignature, type PetitionSignature } from '$lib/schema/petitions/petitions';
import {
	update as updatePerson,
	getIdsFromEmailPhoneNumber,
	create as createPerson
} from '$lib/server/api/people/people';
import { DEFAULT_COUNTRY, parse, type Country } from '$lib/schema/valibot';
import { queue as queueInteraction } from '$lib/server/api/people/interactions';

type SignupType =
	| {
			method: 'event_registration';
			event_id: number;
			event_name: string;
	  }
	| {
			method: 'petition_signature';
			petition_id: number;
			petition_name: string;
	  };

export default async function ({
	instanceId,
	signup,
	adminId,
	country,
	queue,
	type,
	t
}: {
	instanceId: number;
	signup: EventSignup | PetitionSignature;
	adminId: number;
	t: App.Localization;
	queue: App.Queue;
	type: SignupType;
	country: Country;
}): Promise<Read> {
	const signupInfo = signup;
	const emailInfo = parse(update.entries.email, {
		email: signupInfo.email,
		subscribed: signupInfo.opt_in
	});
	const phoneInfo = parse(update.entries.phone_number, {
		phone_number: signupInfo.phone_number,
		country: country,
		subscribed: signupInfo.opt_in
	});
	const personInfo = parse(update, { ...signupInfo, email: emailInfo, phone_number: phoneInfo });
	const getPersonIds = await getIdsFromEmailPhoneNumber({
		instanceId,
		email: signupInfo.email,
		phoneNumber: signupInfo.phone_number
	});
	const promises = getPersonIds.map((id) =>
		updatePerson({
			instance_id: instanceId,
			body: personInfo,
			person_id: id,
			admin_id: adminId,
			t,
			queue
		})
	);
	const updatedPeople = await Promise.all(promises);
	if (updatedPeople.length === 0) {
		const full_name = personInfo.full_name
			? personInfo.full_name.trim()
			: `${personInfo.given_name} ${personInfo.family_name}`.trim(); //TODO: Make name construction dependent on locale
		const createOptions =
			type.method === 'event_registration'
				? { eventId: type.event_id, eventName: type.event_name }
				: { petitionId: type.petition_id, petitionName: type.petition_name };
		const created = await createPerson({
			instance_id: instanceId,
			body: { ...personInfo, country: personInfo.country || country, full_name },
			admin_id: adminId,
			queue,
			method: type.method,
			t,
			options: createOptions
		});
		await queueInteraction({
			personId: created.id,
			adminId: adminId,
			instanceId: instanceId,
			details: {
				type: 'person_added',
				details: type
			},
			queue
		});
		return created;
	} else {
		await queueInteraction({
			personId: updatedPeople[0].id,
			adminId: adminId,
			instanceId: instanceId,
			details: {
				type: 'person_added',
				details: type
			},
			queue
		});
		return updatedPeople[0];
	}
}
