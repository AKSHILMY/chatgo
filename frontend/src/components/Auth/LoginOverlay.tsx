import React, {useState} from "react";
import {logIn} from "../../services/api/auth.tsx";
import {ToastContainer, toast} from 'react-toastify';
import {setLocalStorageItem} from "../../utilities/lib/localStorage.tsx"
import {Loader} from "lucide-react";

interface LoginOverlayProps {
    onLoginSuccess: () => void;
}

const LoginOverlay: React.FC<LoginOverlayProps> = ({onLoginSuccess}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        console.log("Logging in with", { email, password });

        try {
            const res = await logIn({ data: { email, password } });
            console.log(res.data);
            if (res.data.error) {
                toast.error(res.data.message);
            } else {
                setLocalStorageItem("token", res.data.data.token);
                onLoginSuccess();
            }
        } catch (err: any) {
            toast.error(err?.response?.data || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                        {isLoading && (
                            <Loader className="w-5 h-5 animate-spin text-teal-600" />
                        )}
                    </div>
                </form>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default LoginOverlay;

