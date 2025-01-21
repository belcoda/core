import { isBigger } from '$lib/utils/math/number';
import { humanReadableFileSize } from '$lib/utils/text/file_size';
export function getAndCheckFile({
	fileInput,
	t,
	maxFileSize,
	allowedTypes
}: {
	fileInput: HTMLInputElement;
	t: App.Localization;
	maxFileSize: number;
	allowedTypes: string[];
}): File {
	const files = fileInput.files;
	if (!files) throw new Error(t.errors.file_upload.no_file_selected());
	const file = files[files.length - 1];
	checkFileSize(file, t, maxFileSize);
	checkFileType(file, t, allowedTypes);
	return file;
}

export function checkFileSize(file: File, t: App.Localization, maxFileSize: number): void {
	if (isBigger(file.size, maxFileSize)) {
		throw new Error(t.errors.file_upload.too_large(humanReadableFileSize(maxFileSize)));
	}
}

export function checkFileType(file: File, t: App.Localization, allowedTypes: string[]): void {
	if (!allowedTypes.includes(file.type)) {
		throw new Error(t.errors.file_upload.unsupported_type(allowedTypes.join(', ')));
	}
}
import { v4 as uuidv4 } from 'uuid';
export function renameFile(file: File): File {
	const uploadableName = `${uuidv4()}-${file.name}`; // Add a random UUID to the file name to avoid conflicts
	return new File([file], uploadableName, { type: file.type });
}
export async function getSignedURL(
	file: File,
	siteUploadsUrl: string,
	t: App.Localization
): Promise<string> {
	const push_file_request_response = await fetch(siteUploadsUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			file_name: file.name
		})
	});
	if (!push_file_request_response.ok) {
		console.error(await push_file_request_response.json());
		throw new Error(t.errors.file_upload.upload_error());
	}
	const push_file_request_body = await push_file_request_response.json();
	const put_url = push_file_request_body.put_url;
	if (!put_url) {
		console.error(`No put_url in response: ${push_file_request_body}`);
		throw new Error(t.errors.file_upload.upload_error());
	}
	return put_url;
}

export async function uploadToS3({
	file,
	signedURL,
	t
}: {
	file: File;
	signedURL: string;
	t: App.Localization;
}): Promise<string> {
	//upload the file to the signed url
	const aws_response = await fetch(signedURL, {
		method: 'put',
		body: file
	});

	if (!aws_response.ok) {
		console.error('file upload failed');
		console.error(await aws_response.text());
		throw new Error(t.errors.file_upload.upload_error());
	}

	const awsPath = new URL(aws_response.url).pathname; // Get the path of the uploaded file on AWS that we will add to our bucket URL
	return awsPath;
}
