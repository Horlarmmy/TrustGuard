import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import AiLogo from "../assets/ai-logo.png";
import Prism from "prismjs";

const Analyze = () => {
  const [activeCategory, setActiveCategory] = useState("upload");
  const [fileName, setFileName] = useState("");
  const [contractContent, setContractContent] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  const categories = [
    { id: "upload", name: "Upload" },
    { id: "address", name: "Address" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setContractContent(event.target.result);
      setFileName(file.name);
      setError("");
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!contractContent) {
      setError("Please select a file.");
      return;
    }

    try {
      const response = await fetch(
        "https://trustguard-0ue8.onrender.com/audit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: contractContent }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      setAnalysisResults(data);
      Prism.highlightAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderAnalyzeComponent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="flex flex-col justify-center items-center">
            <label className="block text-sm font-medium text-indigo-200">
              Smart Contract File
            </label>

            <div className="relative">
              <div className="overflow-hidden">
                <Upload className="w-24 h-24 text-blue-500 my-4" />
              </div>
              <input
                type="file"
                name="contractFile"
                id="contractFile"
                accept=".sol,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="contractFile"
                className="absolute inset-0 cursor-pointer"
              />
            </div>

            <div className="text-white cursor-pointer border-[2px] px-4 py-2 border-blue-500">
              <label htmlFor="contractFile" className="cursor-pointer">
                {fileName || "Choose a file"}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!contractContent}
            className={`w-full ${
              contractContent
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            } text-white py-2 px-4 rounded-lg transition duration-200`}
          >
            Analyze Contract {fileName && `(${fileName})`}
          </button>
        </form>

        {error && <div className="mt-6 text-red-500">{error}</div>}

        {analysisResults && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Analysis Results
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-indigo-200">
                  Vulnerability Category:
                </h3>
                <p className="text-indigo-100">{analysisResults.category}</p>
              </div>
              {analysisResults.fixed_contract && (
                <div>
                  <h3 className="font-semibold text-lg text-indigo-200">
                    Fixed Snippets:
                  </h3>
                  <div className="text-white mt-4">
                    <pre className="bg-gray-900/90 p-4 rounded-lg overflow-auto border border-indigo-100/40">
                      <code className="text-indigo-100">
                        {analysisResults.fixed_contract}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAddressComponent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-200">
              Contract Address
            </label>
            <input
              type="text"
              name="contractUrl"
              placeholder="Enter contract Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full text-indigo-200 bg-indigo-900/50 border border-indigo-600/30 rounded-lg p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Analyze Contract
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <motion.img
              src={AiLogo}
              alt="AI Bot"
              className="h-44 w-44 object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Smart Contract Auditor and Wallet Reputation Analyzer
          </h1>
          <p className="text-indigo-200">
            Analyze your smart contract to detect vulnerabilities and get
            automated fixes
          </p>
          <p className="text-indigo-200">
            Scan addresses based on their on-chain behavior, interactions, and
            historical data
          </p>
        </div>

        <div className="mb-8">
          <div className="border-b border-indigo-600/30">
            <div className="flex space-x-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-4 px-6 w-full focus:outline-none ${
                    activeCategory === category.id
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-indigo-300 hover:text-blue-400"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Card className="bg-indigo-900/25 border-indigo-600/30">
          <CardContent className="p-6">
            {activeCategory === "upload"
              ? renderAnalyzeComponent()
              : renderAddressComponent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analyze;