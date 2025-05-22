export const redisString = (instance_id: number, admin_id: number | 'all') =>
	`i:${instance_id}:admin:${admin_id}`;
