import React, { useState, useEffect } from 'react';
import { generateAnimeVideo } from './services/geminiService';
import type { VideoConfig, AppStatus } from './types';
import { Status } from './types';
import { LOADING_MESSAGES } from './constants';
import VideoGeneratorForm from './components/VideoGeneratorForm';
import LoadingIndicator from './components/LoadingIndicator';
import VideoResult from './components/VideoResult';
import ApiKeySelector from './components/ApiKeySelector';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(Status.Initial);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        if (await window.aistudio.hasSelectedApiKey()) {
          setStatus(Status.Ready);
        } else {
          setStatus(Status.ApiKeyMissing);
        }
      } catch (e) {
        console.error("Could not check for API key", e);
        setStatus(Status.ApiKeyMissing); // Fallback to asking for a key
      }
    };
    if (status === Status.Initial) {
        checkApiKey();
    }
  }, [status]);


  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (status === Status.Loading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status]);

  const handleApiKeyError = () => {
    setStatus(Status.ApiKeyMissing);
  };

  const handleGenerateVideo = async (config: VideoConfig) => {
    setStatus(Status.Loading);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await generateAnimeVideo(config, setLoadingMessage, handleApiKeyError);
      setVideoUrl(url);
      setStatus(Status.Done);
    } catch (e: any) {
      console.error(e);
      // The API key error is already handled by the callback, so we only set other errors.
      if (status !== Status.ApiKeyMissing) {
        setError(e.message || "An unknown error occurred during video generation.");
        setStatus(Status.Error);
      }
    }
  };

  const handleReset = () => {
    setStatus(Status.Ready);
    setVideoUrl(null);
    setError(null);
  };
  
  const handleKeySelected = () => {
    setStatus(Status.Ready);
  };


  const renderContent = () => {
    switch (status) {
      case Status.Initial:
        return <LoadingIndicator message="Initializing..." />;
      case Status.ApiKeyMissing:
        return <ApiKeySelector onKeySelected={handleKeySelected} />;
      case Status.Loading:
        return <LoadingIndicator message={loadingMessage} />;
      case Status.Done:
        return videoUrl ? <VideoResult videoUrl={videoUrl} onReset={handleReset} /> : null;
      case Status.Error:
        return (
          <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
            <h3 className="text-xl font-bold text-red-400 mb-4">Generation Failed</h3>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case Status.Ready:
      default:
        return <VideoGeneratorForm onSubmit={handleGenerateVideo} isLoading={status === Status.Loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-3xl mx-auto space-y-8">
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Anime Video Generator
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
                Bring your creative visions to life with AI-powered video generation.
            </p>
        </header>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl shadow-purple-900/20 p-6 md:p-8 min-h-[300px] flex flex-col items-center justify-center">
            {renderContent()}
        </div>
        <footer className="text-center text-gray-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;