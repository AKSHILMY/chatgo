import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface SafeLanguageIconProps {
    initialState?: boolean;
    onToggle?: (isEnabled: boolean) => void;
}

const SafeLanguageIcon: React.FC<SafeLanguageIconProps> = ({
    initialState = false,
    onToggle
}) => {
    const [isEnabled, setIsEnabled] = useState(initialState);

    const handleClick = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);

        // Show toast notification
        if (newState) {
            toast.success('Safe Mode Enabled', {
                duration: 2000,
                position: 'top-center',
            });
        } else {
            toast('Safe Mode Disabled', {
                duration: 2000,
                position: 'top-center',
                icon: '⚠️',
            });
        }

        onToggle?.(newState);
    };

    return (
        <div className="relative group">
            <button
                onClick={handleClick}
                className={`w-6 h-6 p-1 rounded-full transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${isEnabled ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'
                    }`}
                aria-label={`Safe language filter ${isEnabled ? 'enabled' : 'disabled'}`}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-full h-full"
                >
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                </svg>
            </button>

            {/* Tooltip */}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {isEnabled ? 'Safe Mode ON' : 'Safe Mode OFF'}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"></div>
            </div>
        </div>
    );
};

export default SafeLanguageIcon;