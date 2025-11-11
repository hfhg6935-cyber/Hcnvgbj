import { GoogleGenAI } from "@google/genai";
import type { ImageConfig, VideoConfig } from '../types';

export const generateAnimeImage = async (
    config: ImageConfig
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `cinematic anime style, ${config.prompt}`,
            config: {
                numberOfImages: 1,
                aspectRatio: config.aspectRatio,
                outputMimeType: 'image/jpeg',
            }
        });

        const image = response.generatedImages[0]?.image?.imageBytes;

        if (!image) {
            throw new Error("Image generation completed, but no image data was found.");
        }

        return `data:image/jpeg;base64,${image}`;
    } catch (e: any) {
        console.error("Gemini API Error:", e);
        throw new Error(e.message || "An unknown error occurred while communicating with the Gemini API.");
    }
};

export const generateAnimeVideo = async (
    config: VideoConfig,
    onApiKeyError: () => void
): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `cinematic, high quality, anime style, ${config.prompt}`,
            config: {
                numberOfVideos: 1,
                resolution: config.resolution,
                aspectRatio: config.aspectRatio,
            },
        });

        while (!operation.done) {
            // Fix: Updated polling interval to 10 seconds as per documentation recommendation.
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        
        if (!downloadLink) {
            throw new Error("Video generation finished, but no download link was provided.");
        }
        
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video: ${videoResponse.statusText}`);
        }

        const blob = await videoResponse.blob();
        return URL.createObjectURL(blob);

    } catch (e: any) {
        console.error("Gemini API Error:", e);
        if (e.message?.includes("Requested entity was not found")) {
            onApiKeyError();
            throw new Error("API Key error. Please re-select your key.");
        }
        throw new Error(e.message || "An unknown error occurred while communicating with the Gemini API.");
    }
};