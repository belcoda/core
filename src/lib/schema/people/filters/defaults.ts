/**
 * User filter defaults
 *
 * @author dmsynge
 * @date 2024-12-16
 *
 * When a user switches between different filter types for filtering a list of people and building a complex advanced search, we need to provide default values for each filter type.
 * Moreover, we need to do so in a type-safe way. This file contains the default values for each filter type.
 */

import { filterTypes } from '$lib/schema/people/filters/filters';
import { v, id } from '$lib/schema/valibot';

export const fullName = v.object({
	...filterTypes.full_name.entries,
	name: v.string()
});
export type FullName = v.InferInput<typeof fullName>;
export const defaultFullName: FullName = {
	type: 'full_name',
	name: '',
	partial: true
};

export const email = v.object({
	...filterTypes.email.entries,
	email: v.string()
});
export type Email = v.InferInput<typeof email>;
export const defaultEmail: Email = {
	type: 'email',
	email: '',
	partial: true,
	mustBeSubscribed: false
};

export const postcode = v.object({
	...filterTypes.postcode.entries,
	postcode: v.string()
});
export type Postcode = v.InferInput<typeof postcode>;
export const defaultPostcode: Postcode = {
	type: 'postcode',
	postcode: '',
	partial: true
};

export const locality = v.object({
	...filterTypes.locality.entries,
	locality: v.string()
});
export type Locality = v.InferInput<typeof locality>;
export const defaultLocality: Locality = {
	type: 'locality',
	locality: '',
	partial: true
};

export const state = v.object({
	...filterTypes.state.entries,
	state: v.string()
});
export type State = v.InferInput<typeof state>;
export const defaultState: State = {
	type: 'state',
	state: '',
	partial: true
};

export const address = v.object({
	...filterTypes.address.entries,
	address: v.string()
});
export type Address = v.InferInput<typeof address>;
export const defaultAddress: Address = {
	type: 'address',
	address: ''
};

export const phoneNumber = v.object({
	...filterTypes.phone_number.entries,
	phone_number: v.string()
});
export type PhoneNumber = v.InferInput<typeof phoneNumber>;
export const defaultPhoneNumber: PhoneNumber = {
	type: 'phone_number',
	phone_number: '',
	partial: true,
	mustBeSubscribed: false,
	mustBeWhatsapp: false
};

export const inList = v.object({
	...filterTypes.in_list.entries,
	list_id: v.nullable(id)
});
export type InList = v.InferInput<typeof inList>;
export const defaultInList: InList = {
	type: 'in_list',
	list_id: null
};

const notInList = v.object({
	...filterTypes.not_in_list.entries,
	list_id: v.nullable(id)
});
export type NotInList = v.InferInput<typeof notInList>;
export const defaultNotInList: NotInList = {
	type: 'not_in_list',
	list_id: null
};

export const hasTag = v.object({
	...filterTypes.has_tag.entries,
	tag_id: v.nullable(id)
});
export type HasTag = v.InferInput<typeof hasTag>;
export const defaultHasTag: HasTag = {
	type: 'has_tag',
	tag_id: null
};

export const notHasTag = v.object({
	...filterTypes.not_has_tag.entries,
	tag_id: v.nullable(id)
});
export type NotHasTag = v.InferInput<typeof notHasTag>;
export const defaultNotHasTag: NotHasTag = {
	type: 'not_has_tag',
	tag_id: null
};

export const registeredEvent = v.object({
	...filterTypes.registered_event.entries,
	event_id: v.nullable(id)
});
export type RegisteredEvent = v.InferInput<typeof registeredEvent>;
export const defaultRegisteredEvent: RegisteredEvent = {
	type: 'registered_event',
	event_id: null,
	status: 'any'
};

export const notRegisteredEvent = v.object({
	...filterTypes.not_registered_event.entries,
	event_id: v.nullable(id)
});
export type NotRegisteredEvent = v.InferInput<typeof notRegisteredEvent>;
export const defaultNotRegisteredEvent: NotRegisteredEvent = {
	type: 'not_registered_event',
	event_id: null,
	status: 'any'
};

export const defaultFilterTypes = v.variant('type', [
	fullName,
	email,
	postcode,
	locality,
	state,
	address,
	phoneNumber,
	inList,
	notInList,
	hasTag,
	notHasTag,
	registeredEvent,
	notRegisteredEvent
]);
export type DefaultFilterTypes = v.InferInput<typeof defaultFilterTypes>;

export const defaults = {
	defaultAddress,
	defaultEmail,
	defaultFullName,
	defaultHasTag,
	defaultInList,
	defaultLocality,
	defaultNotHasTag,
	defaultNotInList,
	defaultNotRegisteredEvent,
	defaultPhoneNumber,
	defaultPostcode,
	defaultRegisteredEvent,
	defaultState
};
