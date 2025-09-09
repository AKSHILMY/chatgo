import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0', // Allows external access
        port: 5173,       // Port used by the Vite server
        allowedHosts: [
            '.ngrok-free.app',  // Allow all ngrok free URLs
        ],
        open: true,           // Optionally open the browser on startup
    },
});
