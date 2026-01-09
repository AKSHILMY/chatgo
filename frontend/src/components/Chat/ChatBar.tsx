import {Power} from 'react-feather';
import React from "react";
import SafeLangIcon from '../Config/SafeLangFilter';

interface ChatBarProps {
    userName?: string
    userImage?: string
}

const ChatBar = ({userImage: uImage, userName: uName}: ChatBarProps) => {

    const handleLogOut = (e : React.FormEvent) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.reload();
    }

    return (
        <div className="bg-teal-800 p-3 flex items-center justify-between z-50">
            <div className="flex items-center">
                {uImage ? (
                    <img src={uImage} alt="Group" className="rounded-full w-8 h-8 mr-3 object-cover"/>
                ) : (
                    <div className="rounded-full bg-white w-8 h-8 mr-3 flex items-center justify-center">
            <span className="text-green-600 font-semibold">
              {uName ? uName.charAt(0).toUpperCase() : 'H'}
            </span>
                    </div>
                )}
                <h2 className="text-lg font-semibold text-white">
                    {uName ? uName : 'Hidden Chat'}
                </h2>
            </div>

            <div className="flex items-center space-x-2">
                <button className="text-white hover:text-green-200">
                    <Power onClick={handleLogOut} className="h-6 w-6"/>
                </button>
                <SafeLangIcon/>
            </div>
        </div>
    );
};

export default ChatBar;