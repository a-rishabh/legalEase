// legalese-simplifier-backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import GoogleGenerativeAI

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10gb' }));

// Google Gemini API key
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key

// Basic route
app.get('/', (req, res) => {
    res.send('Legalese Simplifier Backend is running!');
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function generateWithRetry(model, prompt, retries = 0) {
    try {
        return await model.generateContent(prompt);
    } catch (error) {
        if (error.status === 503 && retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return generateWithRetry(model, prompt, retries + 1);
        }
        throw error;
    }
}

// Analyze document endpoint
app.post('/api/analyze', async (req, res) => {
    const { document } = req.body;

    if (!document) {
        return res.status(400).json({ error: 'Document is required' });
    }

    try {
        // Create an instance of GoogleGenerativeAI
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate content
        const prompt = `You are a legal assistant tasked with summarizing complex legal documents into clear, concise, and user-friendly bullet points. Your target audience is a layperson with no legal background.  Your primary goal is to extract the most critical information and present it in an easily digestible format.  Strictly adhere to the following criteria:

**Summary Requirements:**

*   **Brevity:**  The summary MUST be no more than 100 words.  Prioritize the most important points.
*   **Clarity:** Use plain English, avoiding legal jargon.  Define any unavoidable legal terms in simple language.  Focus on the "what" and "how" of each point, explaining the practical implications for the user.
*   **Bullet Points:**  Present the key information in a bulleted list, with each bullet point addressing a distinct topic or clause.  Aim for 5-7 bullet points.
*   **Focus on User Impact:**  Frame the summaries from the user's perspective.  For example, instead of "The parties agree to binding arbitration," write "You agree to resolve any disputes through arbitration, meaning you can't sue the company in court."
*   **Accuracy:**  Maintain absolute accuracy.  Do not add, remove, or change the meaning of the original text.

**Red Flags:**

In addition to the summary, identify any "red flags" – clauses or provisions that should raise concern or require careful consideration by the user.  These could include:

*   **Unilateral Changes:** Clauses allowing the company to change the terms without notice or consent.
*   **Automatic Renewals:**  Clauses that automatically renew subscriptions or agreements.
*   **Limitations of Liability:**  Clauses limiting the company's liability for damages or losses.
*   **Indemnification Clauses:**  Clauses requiring the user to indemnify the company.
*   **Arbitration Clauses:**  Clauses requiring disputes to be resolved through arbitration, especially if they limit the user's right to sue.
*   **Data Collection and Usage:**  Clauses detailing how the company collects, uses, and shares user data.  Pay close attention to broad or vague language.
*   **Governing Law and Jurisdiction:**  Clauses specifying which state's or country's laws govern the agreement, especially if it's inconvenient for the user.

Present the red flags in a separate bulleted list, explaining why each point is a potential concern.

**Input:**

[Paste the legal text here - e.g., Terms and Conditions, Privacy Policy, Contract, etc.]

**Output Format:**

Summary: \n

*   [Bullet point 1 - User-friendly explanation]\n
*   [Bullet point 2 - User-friendly explanation]\n
*   [Bullet point 3 - User-friendly explanation]\n
*   [Bullet point 4 - User-friendly explanation]\n
*   [Bullet point 5 - User-friendly explanation]\n
*   [Bullet point 6 - User-friendly explanation]\n
*   [Bullet point 7 - User-friendly explanation]\n
\n\n
Red Flags:\n

Red flag 1 - Explanation of why it's a red flag\n
Red flag 2 - Explanation of why it's a red flag\n
Red flag 3 - Explanation of why it's a red flag:\n ${document}`;

        const result = await generateWithRetry(model, prompt);

        // Clean up summary and format it nicely
        const summary = result.response.text().replace(/\*\s*/g, '').trim(); // Remove asterisks and trim whitespace
        const redFlags = extractRedFlags(summary);

        res.json({ summary, redFlags });
    } catch (error) {
        console.error('Error calling Google Gemini API:', error);
        res.status(500).json({ error: 'Failed to analyze document' });
    }
});

// Function to extract red flags
const extractRedFlags = (summary) => {
    try {
        // Split the response into summary and red flags sections
        const sections = summary.split('Red Flags:');
        if (sections.length < 2) return [];

        // Get the red flags section and split by bullet points
        const redFlagsSection = sections[1];
        const redFlags = redFlagsSection
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // Remove asterisk if present
                line = line.replace(/^\*\s*/, '');
                // Remove any remaining asterisks
                line = line.replace(/\*\*/g, '');
                return line;
            });

        return redFlags;
    } catch (error) {
        console.error('Error extracting red flags:', error);
        return [];
    }
};

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
