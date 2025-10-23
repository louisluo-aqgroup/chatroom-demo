'use client';

import { Pause, Send, X } from 'lucide-react';
import { useState } from 'react';

import { useRecordVoice } from './useRecordVoice';
import { VoicePreview } from './VoicePreview';

const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

export interface VoiceInputProps {
    roomId: string;
    onClose?: () => void;
}

export const VoiceInput = ({ roomId, onClose }: VoiceInputProps) => {
    const { isStopped, isRecording, isDisabled, audioBlob, audioUrl, seconds, reset, stop } = useRecordVoice();
    const [isUploading, setIsUploading] = useState(false);

    // 停止（關麥）
    const handlePauseRecording = () => {
        stop();
    };

    const handleCancel = () => {
        reset();
        onClose?.();
    };

    const handleSend = async () => {
        if (!audioBlob) return;

        try {
            setIsUploading(true);
            // TODO: 實作上傳邏輯
            console.log('準備發送語音訊息，大小:', audioBlob.size, 'bytes');

            reset();
            onClose?.();
        } catch (error) {
            console.error('發送語音訊息失敗:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            {/* 取消 */}
            <button
                type="button"
                onClick={handleCancel}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                aria-label="取消錄音"
            >
                <X className="h-5 w-5" />
            </button>

            {/* 中間：狀態 + 秒數 */}
            <div className="flex flex-1 items-center gap-3 rounded-full border border-gray-300 bg-gray-50 px-4 py-2">
                <div className="flex flex-1 items-center gap-2">
                    {isDisabled && <span className="text-xs text-red-600">麥克風權限未開啟</span>}
                    {isRecording && (
                        <>
                            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                            <span className="text-sm text-gray-600">錄音中…</span>
                        </>
                    )}
                    {isStopped && audioUrl && <VoicePreview audioUrl={audioUrl} />}
                </div>

                <div className="text-sm font-medium text-gray-700">{formatTime(seconds)}</div>
            </div>

            {/* 右側：錄製中→停止（關麥）；停止後→送出 */}
            {isStopped ? (
                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!audioBlob || isUploading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
                    aria-label="發送語音訊息"
                >
                    {isUploading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handlePauseRecording}
                    disabled={isDisabled}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300"
                    aria-label="停止錄音"
                    title="停止錄音"
                >
                    <Pause className="h-5 w-5" />
                </button>
            )}
        </>
    );
};
