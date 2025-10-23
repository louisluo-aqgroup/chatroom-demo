import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderState = 'idle' | 'recording' | 'stopped' | 'disabled';

/**
 * 計時器 Hook
 * @param maxSeconds 最大秒數，達到後會觸發 onMaxReached
 * @param onMaxReached 達到最大秒數時的回調函數
 */
interface UseTimerOptions {
    maxSeconds: number;
    onMaxReached?: () => void;
}

const useTimer = ({ maxSeconds, onMaxReached }: UseTimerOptions) => {
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef<number | null>(null);
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        clearTimer();
        setSeconds(0);
        timerRef.current = window.setInterval(() => {
            setSeconds(prev => {
                const next = prev + 1;
                if (next >= maxSeconds) {
                    return maxSeconds;
                }
                return next;
            });
        }, 1000);
    }, [clearTimer, maxSeconds]);

    const resetTimer = useCallback(() => {
        clearTimer();
        setSeconds(0);
    }, [clearTimer]);

    useEffect(() => {
        if (seconds === maxSeconds) {
            onMaxReached?.();
        }
    }, [seconds, onMaxReached, maxSeconds]);

    // 卸載時清理
    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    return {
        seconds,
        startTimer,
        clearTimer,
        resetTimer,
    };
};

export const useRecordVoice = () => {
    const [state, setState] = useState<RecorderState>('idle');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // 使用抽離的計時器 hook
    const { seconds, startTimer, clearTimer, resetTimer } = useTimer({
        maxSeconds: 60,
        onMaxReached: () => {
            stop();
        },
    });

    const isRecording = state === 'recording';
    const isDisabled = state === 'disabled';
    const isStopped = state === 'stopped';

    const checkPermission = useCallback(async () => {
        try {
            const status = await navigator.permissions.query({
                name: 'microphone',
            });
            if (status.state === 'denied') {
                setState('disabled');
                return false;
            }
            return true;
        } catch {
            // Safari 可能不支援 Permissions API：讓 getUserMedia 自行決定
            return true;
        }
    }, []);

    const start = useCallback(async () => {
        const ok = await checkPermission();
        if (!ok) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            streamRef.current = stream;

            // 建立 MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            // 收集音訊資料
            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // 錄音停止時產生 Blob 和 URL
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                setState('stopped');
            };

            // 開始錄音
            mediaRecorder.start();
            setState('recording');
            startTimer();
        } catch (error) {
            console.error('Failed to start recording:', error);
            setState('disabled');
        }
    }, [checkPermission, startTimer]);

    const stop = useCallback(() => {
        // 停止 MediaRecorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        // 停止計時器
        clearTimer();

        // 關閉 MediaStream tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
        }
        streamRef.current = null;
        mediaRecorderRef.current = null;
    }, [clearTimer]);

    const reset = useCallback(() => {
        // 清理現有的 URL
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        // 重置所有狀態
        setAudioBlob(null);
        setAudioUrl(null);
        setState('idle');
        chunksRef.current = [];
        resetTimer();

        // 清理 stream 和 recorder
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, [audioUrl, resetTimer]);

    // 開啟時自動開始錄音
    useEffect(() => {
        start();
    }, [start]);

    // 卸載時清理
    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [audioUrl]);

    return {
        state,
        isRecording,
        isDisabled,
        isStopped,
        start,
        stop,
        audioBlob,
        audioUrl,
        seconds,
        reset,
    };
};
