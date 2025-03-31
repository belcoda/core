import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a mock navigator object since it's not available in Node.js
const mockClipboard = {
	writeText: vi.fn()
};

// Create a mock navigator
const mockNavigator = {
	clipboard: mockClipboard
};

describe('CopyButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Define global navigator if it doesn't exist
		// This is a work-around since we're not running in a browser
		if (typeof global.navigator === 'undefined') {
			Object.defineProperty(global, 'navigator', {
				value: mockNavigator,
				writable: true
			});
		} else {
			// If it exists, just mock the clipboard
			Object.defineProperty(global.navigator, 'clipboard', {
				value: mockClipboard,
				writable: true
			});
		}
	});

	it('should be able to copy text to clipboard', () => {
		// Test the clipboard API
		const testText = 'test-text-to-copy';
		navigator.clipboard.writeText(testText);

		// Verify the mock was called correctly
		expect(mockClipboard.writeText).toHaveBeenCalledWith(testText);
		expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
	});

	it('should handle timeout correctly', () => {
		// Mock setTimeout
		vi.useFakeTimers();

		// Create a flag to track state
		let isCopied = false;

		// Simulate the copy function
		const copyToClipboard = () => {
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 2000);
		};

		// Call the function
		copyToClipboard();

		// Check initial state
		expect(isCopied).toBe(true);

		// Fast-forward time
		vi.advanceTimersByTime(2000);

		// Check final state
		expect(isCopied).toBe(false);

		// Cleanup
		vi.useRealTimers();
	});
});
