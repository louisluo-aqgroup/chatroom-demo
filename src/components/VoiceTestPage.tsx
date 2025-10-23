'use client';

import { useState } from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import { VoiceInput } from './VoiceInput';

export const VoiceTestPage = () => {
    const [showVoiceInput, setShowVoiceInput] = useState(false);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
            <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">語音輸入測試</h1>

                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-gray-700">功能說明：</h2>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                        <li>點擊麥克風按鈕開始錄音</li>
                        <li>錄音中可以看到紅色脈衝動畫和計時器</li>
                        <li>點擊暫停按鈕停止錄音</li>
                        <li>停止後可以預覽播放錄音</li>
                        <li>點擊發送按鈕模擬發送語音</li>
                        <li>點擊 X 按鈕取消錄音</li>
                    </ul>
                </div>

                {!showVoiceInput ? (
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
                        <div className="text-center">
                            <p className="mb-4 text-gray-600">點擊下方按鈕開始測試語音輸入</p>
                            <VoiceInputButton
                                onClick={() => setShowVoiceInput(true)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-300 bg-white p-6">
                        <div className="mb-4">
                            <h3 className="mb-2 font-semibold text-gray-700">語音輸入介面：</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <VoiceInput
                                roomId="test-room"
                                onClose={() => setShowVoiceInput(false)}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-blue-800">提示：</h3>
                    <p className="text-sm text-blue-700">
                        首次使用時瀏覽器會要求麥克風權限，請允許才能正常使用語音功能。
                    </p>
                </div>
            </div>
        </div>
    );
};
