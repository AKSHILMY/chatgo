import ChatComponent from "./Chat/ChatComponent.tsx";
import {useEffect, useState} from "react";
// import SecretKeyLogin from "./Auth/SecretKeyLogin.tsx";
import LoginOverlay from "./Auth/LoginOverlay.tsx";
import {getLocalStorageItem, setLocalStorageItem} from "../utilities/lib/localStorage.tsx";
import getConfig from "../services/api/config.tsx";


const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [chatKey, setChatKey] = useState(0);

    const handleLogin = () => {
        if (!isLoggedIn) {
            setIsLoggedIn(true);
            setChatKey((prev) => prev + 1);
        }
    }

    useEffect(() => {
        const token = getLocalStorageItem("token")
        if (token) {
            setIsLoggedIn(true);
        }
        setIsCheckingAuth(false);
    }, [])
    return (
        <div className="relative w-full h-screen">
            {isCheckingAuth ?
                (
                    <div className="flex items-center justify-center w-full h-screen">
                        <div className="loader"/>
                    </div>
                ) : (
                    <>
                        <ChatComponent key={chatKey} isLoggedIn={isLoggedIn}/>
                        {!isLoggedIn && (
                            <LoginOverlay onLoginSuccess={handleLogin}/>
                        )}
                    </>
                )}
        </div>
    );

}

export default Home;
