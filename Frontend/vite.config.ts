import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
       presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  server: {
    host: true,  // exposes on 0.0.0.0 so mobile can reach it
    proxy: {
      '/api': {
        target: 'https://equityexplorer.onrender.com',
        changeOrigin: true,
      }
    }
  },

    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

})