'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface VoicePreviewProps {
    audioUrl: string;
}

export const VoicePreview = ({ audioUrl }: VoicePreviewProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayback = () => {
        const el = audioRef.current;
        if (!el) return;

        if (isPlaying) {
            el.pause();
        } else {
            el.play().catch(() => {});
        }
    };

    // 監聽音頻元素的播放狀態事件
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            el.currentTime = 0;
        };

        el.addEventListener('play', handlePlay);
        el.addEventListener('pause', handlePause);
        el.addEventListener('ended', handleEnded);

        return () => {
            el.removeEventListener('play', handlePlay);
            el.removeEventListener('pause', handlePause);
            el.removeEventListener('ended', handleEnded);
        };
    }, []);

    // 清理：組件卸載時停止播放
    useEffect(() => {
        const el = audioRef.current;
        return () => {
            if (el) {
                el.pause();
                el.currentTime = 0;
            }
        };
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={togglePlayback}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                aria-label={isPlaying ? '暫停預覽' : '播放預覽'}
            >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <span className="text-sm text-gray-600">{isPlaying ? '播放中…' : '點擊播放預覽'}</span>

            <audio ref={audioRef} className="hidden" src={audioUrl} preload="auto" />
        </>
    );
};
