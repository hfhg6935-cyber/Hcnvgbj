import React, { useState, useEffect } from 'react';
import { generateAnimeImage, generateAnimeVideo } from './services/geminiService';
import type { ImageConfig, VideoConfig, AppStatus } from './types';
import { Status } from './types';
import { LOADING_MESSAGES, VIDEO_LOADING_MESSAGES } from './constants';

import ApiKeySelector from './components/ApiKeySelector';
import ImageGeneratorForm from './components/ImageGeneratorForm';
import VideoGeneratorForm from './components/VideoGeneratorForm';
import LoadingIndicator from './components/LoadingIndicator';
import ImageResult from './components/ImageResult';
import VideoResult from './components/VideoResult';

type GenerationMode = 'Image' | 'Video';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(Status.Initial);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('Image');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (await window.aistudio?.hasSelectedApiKey()) {
        setStatus(Status.Ready);
      } else {
        setStatus(Status.ApiKeyMissing);
      }
    };
    checkApiKey();
  }, []);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (status === Status.Loading) {
      const messages = generationMode === 'Image' ? LOADING_MESSAGES : VIDEO_LOADING_MESSAGES;
      setLoadingMessage(messages[0]);
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = messages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % messages.length;
          return messages[nextIndex];
        });
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, generationMode]);

  const handleReset = () => {
    setStatus(Status.Ready);
    setImageUrl(null);
    setVideoUrl(null);
    setError(null);
  };

  const handleApiKeyError = () => {
    setStatus(Status.ApiKeyMissing);
    setError("API Key not found or invalid. Please select a valid key.");
  };

  const handleGenerateImage = async (config: ImageConfig) => {
    setStatus(Status.Loading);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateAnimeImage(config);
      setImageUrl(url);
      setStatus(Status.Done);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unknown error occurred during image generation.");
      setStatus(Status.Error);
    }
  };

  const handleGenerateVideo = async (config: VideoConfig) => {
    setStatus(Status.Loading);
    setError(null);
    setVideoUrl(null);

    try {
      const url = await generateAnimeVideo(config, handleApiKeyError);
      setVideoUrl(url);
      setStatus(Status.Done);
    } catch (e: any)      {
      console.error(e);
      setError(e.message || "An unknown error occurred during video generation.");
      if (status !== Status.ApiKeyMissing) {
        setStatus(Status.Error);
      }
    }
  }

  const renderContent = () => {
    switch (status) {
      case Status.Initial:
        return <LoadingIndicator message="Initializing..." />;
      case Status.ApiKeyMissing:
        return <ApiKeySelector onKeySelected={() => setStatus(Status.Ready)} />;
      case Status.Loading:
        return <LoadingIndicator message={loadingMessage} />;
      case Status.Done:
        if (imageUrl) return <ImageResult imageUrl={imageUrl} onReset={handleReset} />;
        if (videoUrl) return <VideoResult videoUrl={videoUrl} onReset={handleReset} />;
        return null;
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
        return (
          <>
            <div className="w-full flex justify-center mb-6">
              <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-1 flex space-x-1">
                <button 
                  onClick={() => setGenerationMode('Image')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${generationMode === 'Image' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                    Image
                </button>
                <button 
                  onClick={() => setGenerationMode('Video')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${generationMode === 'Video' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
                    Video
                </button>
              </div>
            </div>
            {generationMode === 'Image' ? (
              <ImageGeneratorForm onSubmit={handleGenerateImage} isLoading={status === Status.Loading} />
            ) : (
              <VideoGeneratorForm onSubmit={handleGenerateVideo} isLoading={status === Status.Loading} />
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-3xl mx-auto space-y-8">
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Anime AI Generator
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
                Create stunning images and videos from your imagination.
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