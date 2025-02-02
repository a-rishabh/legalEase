// api/extract_text.js

const pdfParse = require('pdf-parse');
const axios = require('axios');

// Function to extract text from PDFs
async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF.');
  }
}

// Function to extract text from websites
async function extractTextFromWebsite(url) {
  try {
    const response = await axios.get(url);
    const regex = /<p[^>]*>(.*?)<\/p>/g;
    let match;
    let text = '';

    while ((match = regex.exec(response.data)) !== null) {
      text += match[1] + ' ';
    }

    return text.trim();
  } catch (error) {
    throw new Error('Failed to extract text from website.');
  }
}

module.exports = { extractTextFromPDF, extractTextFromWebsite };
