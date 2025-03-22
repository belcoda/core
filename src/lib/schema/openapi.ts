/* import { API_KEY_HEADER } from '$env/static/private';
import { Localization, DEFAULT_LANGUAGE } from '$lib/i18n';
const t = new Localization(DEFAULT_LANGUAGE);
import * as m from '$lib/paraglide/messages';
type SchemaType = 'string' | 'integer';
type StatusCode =
	| '200'
	| '201'
	| '202'
	| '204'
	| '400'
	| '401'
	| '403'
	| '404'
	| '409'
	| '500'
	| '502'
	| '503'
	| '504';

type Responses = { [key in StatusCode]?: BodySchema };

import { v } from '$lib/schema/valibot';

interface Parameter {
	name: string;
	in: 'query' | 'path' | 'header' | 'cookie';
	required: boolean;
	description?: string;
	schema: {
		type: SchemaType;
	};
}

interface BodySchema {
	description: string;
	content: {
		[contentType: string]: {
			schema: any;
		};
	};
}

import { toJSONSchema, type ToJSONSchemaOptions } from '@gcornut/valibot-json-schema';

export function generateSchema(options: ToJSONSchemaOptions) {
	return toJSONSchema(options);
}

export function generateFilterQueryParams(
	searchParams: string = 'name',
	description?: string
): Parameter[] {
	return [
		{
			name: 'page',
			description: 'The page number to return. Defaults to 1 if not provided',
			in: 'query',
			required: false,
			schema: {
				type: 'integer'
			}
		},
		{
			name: 'perPage',
			description: 'The number of items to return per page. Defaults to 25 if not provided',
			in: 'query',
			required: false,
			schema: {
				type: 'integer'
			}
		},
		{
			name: searchParams,
			description: description
				? `${description} Note: Not case sensitive. Partial matches are supported.`
				: 'Will filter the results based on the provided value. Note: Not case sensitive. Partial matches are supported.',
			in: 'query',
			required: false,
			schema: {
				type: 'string'
			}
		}
	];
}

export interface RouteSpecification {
	path: string;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	queryParams?: Parameter[];
	pathParams?: Parameter[];
	headerParams?: Parameter[];
	cookieParams?: Parameter[];
	requestBody?: BodySchema;
	responses: Responses;
}

type RouteGenerator = {
	path: string;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	description: string;
	queryParams?: Parameter[];
	filter?: {
		searchKey: string;
		description?: string;
	};
	pathParams?: Parameter[];
	body?: RequestBody;
	success: SuccessResponse;
	errors?: ErrorResponse[];
	has404?: boolean;
};

type RequestBody = {
	description?: string;
	schema: v.AnySchema;
};

type SuccessResponse = {
	type: '200' | '201' | '202';
	description: string;
	schema: v.AnySchema;
};

type ErrorResponse = {
	type: '400' | '401' | '403';
	description?: string;
	name: string;
	message: string;
};

function generateQueryParams(
	params: Parameter[] | undefined,
	filter: { searchKey: string; description?: string } | undefined
) {
	const queryParams = [];
	if (typeof filter !== 'undefined')
		queryParams.push(...generateFilterQueryParams(filter.searchKey, filter.description));
	if (typeof params !== 'undefined') queryParams.push(...params);
	return queryParams;
}

function generateError(name: string, message: string) {
	return {
		type: 'object',
		properties: {
			id: {
				type: 'string',
				format: 'uuid',
				description: 'An reference to the specific instance of the error in the logs'
			},
			name: {
				type: 'string',
				description:
					'The name of the error. This is useful for understanding which exact error occured and troubleshooting.'
			},
			message: {
				type: 'string',
				description: 'A human-readable message that describes the error that occurred'
			},
			error: {
				type: 'boolean',
				description: 'Always true if an error occured'
			}
		}
	};
}

function generateResponses(success: SuccessResponse, errors: ErrorResponse[], has404?: boolean) {
	const responses: Responses = {
		[success.type]: {
			description: success.description,
			content: {
				'application/json': {
					schema: generateSchema({ schema: success.schema })
				}
			}
		}
	};
	errors.forEach((error) => {
		responses[error.type] = {
			description: error.description || 'Error',
			content: {
				'application/json': {
					schema: generateError(error.name, error.message)
				}
			}
		};
	});
	responses['500'] = {
		description: 'Internal Server Error',
		content: {
			'application/json': {
				schema: generateError('Internal Server Error', m.spry_ago_baboon_cure())
			}
		}
	};
	(responses['403'] = {
		description: 'Forbidden',
		content: {
			'application/json': {
				schema: generateError('Forbidden', m.full_grand_pelican_assure())
			}
		}
	}),
		(responses['401'] = {
			description: 'Unauthorized',
			content: {
				'application/json': {
					schema: generateError('Unauthorized', m.due_swift_lizard_list())
				}
			}
		});
	if (has404) {
		responses['404'] = {
			description: 'Not Found',
			content: {
				'application/json': {
					schema: generateError('Not Found', m.that_tasty_dove_pop())
				}
			}
		};
	}
	return responses;
}

export function generateRoute(options: RouteGenerator): RouteSpecification {
	const queryParams = generateQueryParams(options.queryParams, options.filter);
	let returnObject: RouteSpecification = {
		path: options.path,
		method: options.method,
		queryParams: queryParams,
		pathParams: options.pathParams,
		headerParams: [
			{
				name: API_KEY_HEADER,
				in: 'header',
				required: true,
				schema: {
					type: 'string'
				}
			}
		],
		requestBody: {
			description: options.body?.description || 'The request body',
			content: {
				'application/json': {
					schema: options.body?.schema ? generateSchema({ schema: options.body?.schema }) : {}
				}
			}
		},
		responses: generateResponses(options.success, options.errors || [])
	};
	if (queryParams.length <= 0) delete returnObject.queryParams;
	if (!options.pathParams) delete returnObject.pathParams;
	if (!options.body) delete returnObject.requestBody;
	return returnObject;
}
 */
