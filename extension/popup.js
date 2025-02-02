document.getElementById('extract-btn').addEventListener('click', () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length > 0) {
			chrome.tabs.sendMessage(tabs[0].id, { command: 'extract' }, (response) => {
				if (chrome.runtime.lastError) {
					console.error('Error sending message:', chrome.runtime.lastError);
					alert('Content script not found. Please ensure you are on a valid page.');
					return;
				}
				if (response && response.text) {
					sendToBackend(response.text);
				}
			});
		}
	});
});

async function sendToBackend(extractedText) {
	try {
		const res = await fetch('http://localhost:5001/api/analyze', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ document: extractedText })
		});
		const data = await res.json();
		
		// Create summary section
		const summaryText = document.createElement('div');
		summaryText.textContent = 'Summary:';
		
		// Create red flags section
		const redFlagsTitle = document.createElement('div');
		redFlagsTitle.textContent = 'Red Flags:';
		
		// Create red flags list
		const redFlagsList = document.createElement('ul');
		data.redFlags.forEach(flag => {
			const li = document.createElement('li');
			li.textContent = flag;
			redFlagsList.appendChild(li);
		});

		// Clear and update the summary element
		const summaryElement = document.getElementById('summary');
		summaryElement.innerHTML = '';
		summaryElement.appendChild(summaryText);
		summaryElement.appendChild(document.createTextNode(data.summary));
		summaryElement.appendChild(redFlagsTitle);
		summaryElement.appendChild(redFlagsList);
	} catch (error) {
		console.error('Error:', error);
	}
}
