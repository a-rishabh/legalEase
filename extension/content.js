console.log('Content script loaded');

function extractTextFromPage() {
	const paragraphs = document.querySelectorAll('p, li, span');
	let textContent = '';
	paragraphs.forEach(p => textContent += p.innerText + ' ');
	return textContent.trim();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.command === 'extract') {
		const extractedText = extractTextFromPage();
		sendResponse({ text: extractedText });
		return true;
	} else {
		sendResponse({ text: null });
		return true;
	}
});
