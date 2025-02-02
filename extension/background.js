chrome.runtime.onInstalled.addListener(() => {
	console.log('Policy Decoder Pro Installed!');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.command === 'extract') {
		// Handle extraction command if needed
	}
});
