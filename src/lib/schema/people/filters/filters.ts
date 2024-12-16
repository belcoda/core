import { v, id, mediumStringNotEmpty, shortStringNotEmpty } from '$lib/schema/valibot';
import { attendeeStatus } from '$lib/schema/events/attendees';

export const filterTypesOptions = v.picklist([
	'email',
	'full_name',
	'postcode',
	'locality',
	'state',
	'address',
	'phone_number',
	'in_list',
	'not_in_list',
	'has_tag',
	'not_has_tag',
	'registered_event',
	'not_registered_event'
]);
export type FilterTypesOptions = v.InferOutput<typeof filterTypesOptions>;

export const filterTypes = {
	email: v.object({
		type: v.literal('email'),
		mustBeSubscribed: v.boolean(),
		email: mediumStringNotEmpty, //not email type to allow partial matches
		partial: v.boolean()
	}),
	full_name: v.object({
		type: v.literal('full_name'),
		name: mediumStringNotEmpty,
		partial: v.boolean()
	}),
	postcode: v.object({
		type: v.literal('postcode'),
		postcode: shortStringNotEmpty,
		partial: v.boolean()
	}),
	locality: v.object({
		type: v.literal('locality'),
		locality: shortStringNotEmpty,
		partial: v.boolean()
	}),
	state: v.object({
		type: v.literal('state'),
		state: shortStringNotEmpty,
		partial: v.boolean()
	}),
	address: v.object({
		type: v.literal('address'),
		address: mediumStringNotEmpty
	}),
	phone_number: v.object({
		type: v.literal('phone_number'),
		phone_number: shortStringNotEmpty,
		mustBeSubscribed: v.boolean(),
		mustBeWhatsapp: v.boolean(),
		partial: v.boolean()
	}),

	in_list: v.object({
		type: v.literal('in_list'),
		list_id: id
	}),
	not_in_list: v.object({
		type: v.literal('not_in_list'),
		list_id: id
	}),
	has_tag: v.object({
		type: v.literal('has_tag'),
		tag_id: id
	}),
	not_has_tag: v.object({
		type: v.literal('not_has_tag'),
		tag_id: id
	}),
	registered_event: v.object({
		type: v.literal('registered_event'),
		event_id: id,
		status: v.picklist([...attendeeStatus.options, 'any'])
	}),
	not_registered_event: v.object({
		type: v.literal('not_registered_event'),
		event_id: id,
		status: v.picklist([...attendeeStatus.options, 'any'])
	})
};

export type FilterTypeAddress = v.InferOutput<typeof filterTypes.address>;
export type FilterTypeEmail = v.InferOutput<typeof filterTypes.email>;
export type FilterTypeFullName = v.InferOutput<typeof filterTypes.full_name>;
export type FilterTypeLocality = v.InferOutput<typeof filterTypes.locality>;
export type FilterTypePhoneNumber = v.InferOutput<typeof filterTypes.phone_number>;
export type FilterTypePostcode = v.InferOutput<typeof filterTypes.postcode>;
export type FilterTypeState = v.InferOutput<typeof filterTypes.state>;
export type FilterTypeInList = v.InferOutput<typeof filterTypes.in_list>;
export type FilterTypeNotInList = v.InferOutput<typeof filterTypes.not_in_list>;
export type FilterTypeHasTag = v.InferOutput<typeof filterTypes.has_tag>;
export type FilterTypeNotHasTag = v.InferOutput<typeof filterTypes.not_has_tag>;
export type FilterTypeRegisteredEvent = v.InferOutput<typeof filterTypes.registered_event>;
export type FilterTypeNotRegisteredEvent = v.InferOutput<typeof filterTypes.not_registered_event>;

export const filterType = v.variant('type', [
	filterTypes.address,
	filterTypes.email,
	filterTypes.full_name,
	filterTypes.locality,
	filterTypes.phone_number,
	filterTypes.postcode,
	filterTypes.state,
	filterTypes.in_list,
	filterTypes.not_in_list,
	filterTypes.has_tag,
	filterTypes.not_has_tag,
	filterTypes.registered_event,
	filterTypes.not_registered_event
]);
export type FilterType = v.InferOutput<typeof filterType>;

export type FilterGroup = {
	type: 'group';
	groups: FilterGroup[];
	filters: FilterType[];
	logic: 'AND' | 'OR' | 'NOT';
};

export const filterGroup: v.GenericSchema<FilterGroup> = v.object({
	type: v.literal('group'),
	groups: v.array(v.lazy(() => filterGroup)),
	filters: v.array(filterType),
	logic: v.picklist(['AND', 'OR', 'NOT'])
});

export const DEFAULT_FILTER_GROUP: FilterGroup = {
	type: 'group',
	groups: [],
	filters: [
		{
			type: 'full_name',
			name: '',
			partial: true
		}
	],
	logic: 'AND'
};

export const personIdsOutput = v.array(v.object({ id: id }));

export const createListFromFilter = v.object({
	filter: filterGroup,
	list_id: id
});
export type CreateListFromFilter = v.InferOutput<typeof createListFromFilter>;
