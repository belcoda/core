#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkForConsoleLogs() {
	try {
		// Get the staged files that are about to be pushed
		const { stdout: gitFiles } = await execAsync('git diff --name-only HEAD');

		// Filter for relevant file types
		const relevantFiles = gitFiles
			.split('\n')
			.filter((file) => /\.(js|ts|svelte|jsx|tsx)$/.test(file))
			.filter(Boolean);

		if (relevantFiles.length === 0) {
			console.log('No relevant files to check.');
			process.exit(0);
		}

		// Search for console.log in the files
		const { stdout } = await execAsync(`grep -n "console.log" ${relevantFiles.join(' ')} || true`);

		if (stdout) {
			console.error(
				'\x1b[31m%s\x1b[0m',
				'Error: console.log statements found in the following locations:'
			);
			console.error(stdout);
			console.error('\x1b[33m%s\x1b[0m', 'Please remove console.log statements before pushing.');
			process.exit(1);
		} else {
			console.log('\x1b[32m%s\x1b[0m', 'No console.log statements found. Proceeding with push.');
			process.exit(0);
		}
	} catch (error) {
		if (error.stderr && !error.stderr.includes('grep')) {
			console.error('Error checking for console.log statements:', error);
			process.exit(1);
		}
		// If grep returns no results, that's fine
		process.exit(0);
	}
}

checkForConsoleLogs();
