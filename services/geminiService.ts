import { GoogleGenAI } from "@google/genai";
import type { VideoConfig } from '../types';

export const generateAnimeVideo = async (
    config: VideoConfig,
    onProgressUpdate: (message: string) => void,
    onApiKeyError: () => void
): Promise<string> => {
    // A new instance is created to ensure it uses the latest selected key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `anime style, ${config.prompt}`,
            config: {
                numberOfVideos: 1,
                resolution: config.resolution,
                aspectRatio: config.aspectRatio,
            }
        });

        onProgressUpdate("Video generation started. Polling for results...");

        let pollCount = 0;
        while (!operation.done) {
            pollCount++;
            onProgressUpdate(`Polling for results... (Attempt ${pollCount})`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }

        onProgressUpdate("Fetching generated video...");

        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
             const errorText = await response.text();
             // Check if the download error is also an auth error
             if (response.status === 404) {
                onApiKeyError();
                throw new Error("API Key error. Please select your API key again.");
             }
            throw new Error(`Failed to download video file. Status: ${response.status}. Message: ${errorText}`);
        }
        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);
    } catch (e: any) {
        console.error("Gemini API Error:", e);
        // Specifically check for the NOT_FOUND error which indicates an API key issue
        if (e.message?.includes('Requested entity was not found') || e.status === 'NOT_FOUND') {
            onApiKeyError();
            throw new Error('API Key error. Please select your API key again.');
        }
        throw new Error(e.message || "An unknown error occurred while communicating with the Gemini API.");
    }
};