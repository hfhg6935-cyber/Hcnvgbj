
import React, { useState } from 'react';
import type { VideoConfig } from '../types';

interface VideoGeneratorFormProps {
    onSubmit: (config: VideoConfig) => void;
    isLoading: boolean;
}

const VideoGeneratorForm: React.FC<VideoGeneratorFormProps> = ({ onSubmit, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        onSubmit({ prompt, aspectRatio, resolution });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="flex flex-col">
                <label htmlFor="prompt" className="mb-2 font-semibold text-gray-300">
                    Video Prompt
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 font-semibold text-gray-300">Aspect Ratio</label>
                    <div className="flex space-x-3">
                         {['16:9', '9:16'].map(ratio => (
                            <button
                                key={ratio}
                                type="button"
                                onClick={() => setAspectRatio(ratio as '16:9' | '9:16')}
                                className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-medium border ${aspectRatio === ratio ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                                disabled={isLoading}
                            >
                                {ratio} {ratio === '16:9' ? '(Landscape)' : '(Portrait)'}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="block mb-2 font-semibold text-gray-300">Resolution</label>
                    <div className="flex space-x-3">
                         {['720p', '1080p'].map(res => (
                            <button
                                key={res}
                                type="button"
                                onClick={() => setResolution(res as '720p' | '1080p')}
                                className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-medium border ${resolution === res ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                                disabled={isLoading}
                            >
                                {res}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
                {isLoading ? 'Generating...' : 'Generate Video'}
            </button>
        </form>
    );
};

export default VideoGeneratorForm;
