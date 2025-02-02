import React, { useState } from 'react';
import { AlertTriangle, FileText, Check, Loader2 } from 'lucide-react';

interface Analysis {
  summary: string;
  redFlags: string[];
}

function App() {
  const [document, setDocument] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing document:', error);
      alert('Failed to analyze document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Legal Document Analyzer</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Input Legal Document</h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your legal document here..."
              value={document}
              onChange={(e) => setDocument(e.target.value)}
            />
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={analyzeDocument}
              disabled={!document.trim() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Analyzing...
                </>
              ) : (
                'Analyze Document'
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
            {analysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    Summary
                  </h3>
                  <p className="mt-2 text-gray-600 bg-gray-50 p-4 rounded-md">
                    {analysis.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium flex items-center gap-2 text-gray-700">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Red Flags
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {analysis.redFlags.map((flag, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 bg-red-50 p-3 rounded-md text-red-700"
                      >
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Enter a document and click analyze to see results</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;