import React, { useState } from 'react';
import type { ImageConfig } from '../types';

interface ImageGeneratorFormProps {
    onSubmit: (config: ImageConfig) => void;
    isLoading: boolean;
}

const ImageGeneratorForm: React.FC<ImageGeneratorFormProps> = ({ onSubmit, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<ImageConfig['aspectRatio']>('16:9');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        onSubmit({ prompt, aspectRatio });
    };

    const aspectRatioOptions: { value: ImageConfig['aspectRatio'], label: string }[] = [
        { value: '16:9', label: '16:9 (Landscape)' },
        { value: '9:16', label: '9:16 (Portrait)' },
        { value: '1:1', label: '1:1 (Square)' },
        { value: '4:3', label: '4:3 (Standard)' },
        { value: '3:4', label: '3:4 (Vertical)' },
    ];

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="flex flex-col">
                <label htmlFor="prompt" className="mb-2 font-semibold text-gray-300">
                    Image Prompt
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A samurai fighting a dragon on a volcano"
                    rows={4}
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="block mb-2 font-semibold text-gray-300">Aspect Ratio</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                     {aspectRatioOptions.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setAspectRatio(value)}
                            className={`py-2 px-3 rounded-lg transition-colors text-sm font-medium border ${aspectRatio === value ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                            disabled={isLoading}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
        </form>
    );
};

export default ImageGeneratorForm;
