import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Read CSV content from local testing data folder
 * @param fileName - Name of the CSV file (e.g., 'people.csv')
 * @returns Promise<string> - The CSV content as a string
 */
export async function getCsvFromLocalFolder(fileName: string): Promise<string> {
	try {
		// Construct the path to the CSV file in testing/data/imports
		const csvPath = join(
			process.cwd(),
			'src',
			'lib',
			'utils',
			'testing',
			'data',
			'imports',
			fileName
		);

		// Read the file synchronously and return as string
		const csvContent = readFileSync(csvPath, 'utf-8');

		return csvContent;
	} catch (error) {
		throw new Error(
			`Failed to read CSV file ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

/**
 * Alternative async version using fs.promises
 */
export async function getCsvFromLocalFolderAsync(fileName: string): Promise<string> {
	const { readFile } = await import('fs/promises');

	try {
		// Construct the path to the CSV file in testing/data/imports
		const csvPath = join(
			process.cwd(),
			'src',
			'lib',
			'utils',
			'testing',
			'data',
			'imports',
			fileName
		);

		// Read the file asynchronously and return as string
		const csvContent = await readFile(csvPath, 'utf-8');

		return csvContent;
	} catch (error) {
		throw new Error(
			`Failed to read CSV file ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

/**
 * List available CSV files in the testing/data/imports directory
 */
export async function listAvailableCsvFiles(): Promise<string[]> {
	const { readdir } = await import('fs/promises');

	try {
		const importsPath = join(process.cwd(), 'src', 'lib', 'utils', 'testing', 'data', 'imports');
		const files = await readdir(importsPath);

		// Filter to only CSV files
		return files.filter((file) => file.endsWith('.csv'));
	} catch (error) {
		throw new Error(
			`Failed to list CSV files: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}
