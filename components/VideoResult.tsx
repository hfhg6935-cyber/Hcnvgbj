
import React from 'react';

interface VideoResultProps {
    videoUrl: string;
    onReset: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, onReset }) => {
    return (
        <div className="w-full flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold text-center text-green-400">Video Generation Complete!</h2>
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a
                    href={videoUrl}
                    download="anime-video.mp4"
                    className="flex-1 text-center py-3 px-6 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                >
                    Download Video
                </a>
                <button
                    onClick={onReset}
                    className="flex-1 text-center py-3 px-6 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors"
                >
                    Create Another
                </button>
            </div>
        </div>
    );
};

export default VideoResult;
