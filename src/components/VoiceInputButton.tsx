'use client';

import { Mic } from 'lucide-react';

interface VoiceInputButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export const VoiceInputButton = ({ onClick, disabled }: VoiceInputButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="語音輸入"
            title="語音輸入"
        >
            <Mic className="h-5 w-5" />
        </button>
    );
};
