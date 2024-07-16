import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

const client = new S3Client({
	region: 'us-east-1',
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY
	}
});

export default async function (
	bucket_name: string,
	file_key: string,
	expires_in_seconds: number = 3600
) {
	const command = new PutObjectCommand({ Bucket: bucket_name, Key: file_key });
	const url = await getSignedUrl(client, command, { expiresIn: expires_in_seconds });
	return url;
}
