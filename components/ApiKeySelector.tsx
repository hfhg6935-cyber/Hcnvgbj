
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume success and update the state in parent component
      onKeySelected();
    } catch (error) {
      console.error("Error opening API key selection dialog:", error);
    }
  };

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4 text-purple-300">API Key Required</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        To use the Anime Video Generator, you need to select a Google AI Studio API key. This service may incur charges.
      </p>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleSelectKey}
          className="w-full max-w-xs px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
        >
          Select API Key
        </button>
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-indigo-400 underline"
        >
          Learn more about billing
        </a>
      </div>
    </div>
  );
};

export default ApiKeySelector;
