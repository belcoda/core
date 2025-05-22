export function redisString(instanceId: number, groupId: number | 'all', banned?: boolean) {
	const bannedSuffix = banned ? ':banned' : '';
	return `i:${instanceId}:groups:${groupId}${bannedSuffix}`;
}
