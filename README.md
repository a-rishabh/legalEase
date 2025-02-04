# Legalese Simplifier

## Project Overview

The **Legalese Simplifier** is a web application designed to help users understand complex legal documents by summarizing them into clear, concise, and user-friendly bullet points. The application leverages AI technology, specifically the Google Generative AI, to analyze legal texts and extract critical information, including potential red flags that users should be aware of. The project consists of a backend server, a frontend application, and a browser extension that facilitates document extraction from web pages.

### Project Structure

The project is organized into the following main directories:

- **legalese-simplifier-backend**: Contains the backend server code that handles API requests and interacts with the Google Generative AI.
- **legalese-simplifier**: Contains the React frontend application that provides the user interface for document input and displays analysis results.
- **extension**: Contains the browser extension code that allows users to extract text from web pages and send it to the backend for analysis.

## Technologies Used

- **Backend**: Node.js, Express, Google Generative AI
- **Frontend**: React, TypeScript
- **Browser Extension**: JavaScript, Chrome APIs
- **Styling**: Tailwind CSS for the frontend UI
- **Testing**: Python for testing the AI model

## Features

1. **Document Analysis**: Users can paste legal documents into the application, which are then analyzed by the backend to generate summaries and identify red flags.
2. **Browser Extension**: Users can extract text from any webpage and send it directly to the backend for analysis.
3. **User-Friendly Interface**: The frontend is designed to be intuitive, providing clear instructions and feedback to users.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Python (for testing)
- Google API key for Google Generative AI

### Backend Setup

1. Navigate to the `legalese-simplifier-backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your Google API key in `server.js`:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to the `legalese-simplifier` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```

### Browser Extension Setup

1. Navigate to the `extension` directory.
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension` directory.

## Troubleshooting and Errors Faced

### 1. API Key Issues
- **Error**: The application failed to connect to the Google Generative AI API.
- **Solution**: Ensure that the API key is correctly set in `server.js` and that it has the necessary permissions enabled in the Google Cloud Console.

### 2. CORS Errors
- **Error**: CORS policy blocked the request from the frontend to the backend.
- **Solution**: Ensure that the CORS middleware is correctly configured in the backend server. The following line should be included:
  ```javascript
  app.use(cors());
  ```

### 3. Network Response Errors
- **Error**: The frontend displayed an error message indicating that the network response was not okay.
- **Solution**: Check the backend server logs for any errors during the request handling. Ensure that the backend is running and accessible at the specified URL.

### 4. Text Extraction Issues
- **Error**: The browser extension did not extract text from the webpage.
- **Solution**: Verify that the content script is correctly injected into the active tab and that the `extractTextFromPage` function is correctly selecting the desired elements.

### 5. Summary Formatting
- **Error**: The summary displayed in the frontend contained unwanted characters (e.g., asterisks).
- **Solution**: Update the summary processing logic in the backend to clean up the text before sending it to the frontend.

## Conclusion

The Legalese Simplifier project aims to make legal documents more accessible to the general public by utilizing AI technology. Through continuous testing and troubleshooting, the project has evolved to provide a robust solution for document analysis. Future improvements may include enhancing the AI model's capabilities, improving the user interface, and expanding the browser extension's functionality. 

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
