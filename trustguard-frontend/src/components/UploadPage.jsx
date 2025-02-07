import { useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-solidity";
import "prismjs/themes/prism-tomorrow.css"; // Dark code theme

function UploadPage() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileInput = e.target.elements.contractFile;
    const file = fileInput.files[0];

    if (!file) {
      setError("Please select a file.");
      return;
    }
    setError("");
    const mockResults = {
      category: "Reentrancy Attack",
      fixed_contract: "contract FixedExample { /* fixed code */ }",
      code_snippets: [{ fix: "modifier nonReentrant { /* logic */ }" }],
    };
    setAnalysisResults(mockResults);
    Prism.highlightAll();
  };

  return (
    <div className="min-h-screen bg-black/60 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Analyze Smart Contract
        </h1>
        <div className="max-w-xl mx-auto bg-gray-900 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Smart Contract File
              </label>
              <input
                type="file"
                name="contractFile"
                accept=".sol,.txt"
                required
                className="mt-1 block w-full text-sm text-gray-500 bg-gray-700 border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Analyze Contract
            </button>
          </form>

          {error && <div className="mt-6 text-red-500">{error}</div>}

          {analysisResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Vulnerability Category:
                  </h3>
                  <p>{analysisResults.category}</p>
                </div>
                {/* <div>
                  <h3 className="font-semibold text-lg">Fixed Contract:</h3>
                  <pre className="bg-gray-800 p-4 rounded-md overflow-auto">
                    <code className="language-solidity">
                      {analysisResults.fixed_contract}
                    </code>
                  </pre>
                </div> */}
                {analysisResults.code_snippets && (
                  <div>
                    <h3 className="font-semibold text-lg">Fixed Snippets:</h3>
                    {analysisResults.code_snippets.map((snippet, index) => (
                      <div key={index} className="text-white mt-4">
                        <h4 className="font-medium mb-2">Fix {index + 1}</h4>
                        <pre className="bg-gray-800 p-4 rounded-md overflow-auto">
                          <code className="language-solidity">
                            {snippet.fix}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
