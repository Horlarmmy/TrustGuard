/* eslint-disable react/prop-types */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import AiLogo from "../assets/ai-logo.png";

const Analyze = ({ analysisResults, error, handleSubmit }) => {
  const [activeCategory, setActiveCategory] = useState("upload");
  const [file, setFileImage] = useState(null);

  const categories = [
    { id: "upload", name: "Upload" },
    { id: "address", name: "Address" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setFileImage(file);
    }
  };

  const renderAnalyzeComponent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col justify-center items-center">
            <label className="block text-sm font-medium text-indigo-200">
              Smart Contract File
            </label>

            <div className="relative">
              <div className="  overflow-hidden">
                <Upload className="w-24 h-24  text-teal-500 my-4" />
              </div>
              <input
                type="file"
                name="contractFile"
                id="contractFile"
                accept=".sol,.txt"
                required
                onChange={handleFileChange}
                className="hidden"
              />

              <label
                htmlFor="contractFile"
                className="absolute inset-0 cursor-pointer"
              />
            </div>
            <div className="text-white cursor-pointer border-[2px] px-4 py-2 border-teal-500">
              <label htmlFor="contractFile" className="cursor-pointer">
                {file ? `${file.name}` : "Choose a file"}
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-200"
          >
            Analyze Contract {file && `(${file.name})`}
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
              {analysisResults.code_snippets && (
                <div>
                  <h3 className="font-semibold text-lg text-indigo-200">
                    Fixed Snippets:
                  </h3>
                  {analysisResults.code_snippets.map((snippet, index) => (
                    <div key={index} className="text-white mt-4">
                      <h4 className="font-medium mb-2">Fix {index + 1}</h4>
                      <pre className="bg-indigo-900/50 p-4 rounded-lg overflow-auto border border-indigo-600/30">
                        <code className="text-indigo-100">{snippet.fix}</code>
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
  );

  const renderAddressComponent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-200">
              Contract Address
            </label>
            <input
              type="url"
              name="contractUrl"
              placeholder="Enter contract Address"
              required
              className="mt-1 block w-full text-indigo-200 bg-indigo-900/50 border border-indigo-600/30 rounded-lg p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-200"
          >
            Analyze Contract
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <motion.img
              src={AiLogo}
              alt="AI Bot"
              className="h-44 w-44   object-contain"
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

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="border-b border-indigo-600/30">
            <div className="flex space-x-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-4 px-6 w-full focus:outline-none ${
                    activeCategory === category.id
                      ? "border-b-2 border-teal-500 text-teal-500"
                      : "text-indigo-300 hover:text-teal-400"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
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
