import { useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-solidity";
import "prismjs/themes/prism-tomorrow.css"; // Dark code theme
import Analyze from "@/components/Analyze";

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
    <div className="min-h-screen overflow-hidden bg-black/60 text-white">
      <div className="  mx-auto py-8 px-4">
        <Analyze
          analysisResults={analysisResults}
          error={error}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default UploadPage;
