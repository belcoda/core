import { db } from '$lib/server/utils/db/index';
const DEFAULT_AMOUNT_PER_PAGE: 25 = 25;

function get_number(input: string | null, DEFAULT = 1) {
	if (!input) return DEFAULT;
	if (isNaN(Number(input))) return DEFAULT;
	if (Number(input) === 0) return DEFAULT;
	return Number(input);
}

type FilterQueryOptions = {
	search_key?: string;
	order_by?: 'updated_at' | 'created_at';
	default_limit?: number;
	default_offset?: 0;
	notPaged?: boolean;
	searchKeys?: string[];
	andOr?: 'AND' | 'OR';
};

export function filterPersonTags(url: URL): number[] {
	const tags = url.searchParams.getAll('tag');
	const tagIds = tags.map((tag) => parseInt(tag));
	return tagIds;
}
import {
	COMMUNICATION_INTERACTION_TYPES,
	ACTIVITY_INTERACTION_TYPES
} from '$lib/schema/people/interactions';
export function filterInteractions(url?: URL) {
	let type: 'communications' | 'activity' | null = null;
	if (url?.searchParams.get('display') === 'communications') type = 'communications';
	if (url?.searchParams.get('display') === 'activity') type = 'activity';
	//either it's activity, or conditions or simply just not null...
	const typeConditions =
		type === 'activity'
			? db.conditions.isIn(ACTIVITY_INTERACTION_TYPES)
			: type === 'communications'
				? db.conditions.isIn(COMMUNICATION_INTERACTION_TYPES)
				: db.conditions.isNotNull;
	return typeConditions;
}

export function filterQuery(
	url: URL,
	options?: FilterQueryOptions
): { filtered: boolean; where: WhereReturnType; options: PagedFilterOutput } {
	const query_options = pagedQuery(url, options?.order_by, options?.notPaged);
	const isFiltered = filtered(query_options, options?.default_limit, options?.default_offset);
	const where = getWhere(url, options?.search_key, options?.searchKeys, options?.andOr);
	const filteredStatus = Object.keys(where).length > 0 ? true : isFiltered;

	return { filtered: filteredStatus, where, options: query_options };
}

type PagedFilterOutput = {
	order: {
		by: 'updated_at' | 'created_at';
		direction: 'ASC' | 'DESC';
	};
	offset: number;
	limit: number | undefined;
};

export function filtered(
	input: PagedFilterOutput,
	default_limit: number = 25,
	default_offset = 0
): boolean {
	return !(
		input.limit === default_limit &&
		input.offset === default_offset &&
		input.order.by === 'updated_at' &&
		input.order.direction === 'DESC'
	);
}

export function pagedQuery(
	url: URL,
	order_by: 'updated_at' | 'created_at' = 'updated_at',
	notPaged = false
): PagedFilterOutput {
	const page = get_number(url.searchParams.get('page'));
	const amount_per_page = get_number(url.searchParams.get('perPage'), DEFAULT_AMOUNT_PER_PAGE);
	const offset = (page - 1) * amount_per_page;
	const limit = notPaged ? undefined : amount_per_page;
	const direction: 'DESC' = 'DESC';
	return {
		order: {
			by: order_by,
			direction: direction
		},
		offset: offset,
		limit: limit
	};
}
type WhereReturnType = { [key: string]: ReturnType<typeof db.conditions.ilike | typeof db.sql> };
export function getWhere(
	url: URL,
	key: string = 'name',
	searchKeys: string[] = [],
	andOr: 'AND' | 'OR' = 'AND'
): WhereReturnType {
	const search = url.searchParams.get(key);

	function buildAndOrString(index: number, count: number, andOr: 'AND' | 'OR') {
		if (index === count - 1) return '';
		if (andOr === 'AND') return '';
		return ` OR `;
	}

	if (!search) return {};
	if (searchKeys.length > 0) {
		const response: WhereReturnType = {};
		searchKeys.forEach((specifiedKey, i) => {
			if (specifiedKey === 'email') {
				response['email_proxy'] = db.conditions.ilike(`%${search}%`);
			} else if (specifiedKey === 'phone_number') {
				response['phone_number_proxy'] = db.conditions.ilike(`%${search}%`);
			} else {
				response[specifiedKey] = db.conditions.ilike(`%${search}%`);
			}
		});
		console.log(response);
		return response;
	}
	const response = { [key]: db.conditions.ilike(`%${search}%`) };
	return response;
}
