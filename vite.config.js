import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',

    build: {
        outDir: 'dist',
        assetsDir: 'assets',


        sourcemap: false,

        minify: 'terser',
        terserOptions: {
            compress: {

                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.warn']
            },
            mangle: {
                safari10: true
            }
        },

        rollupOptions: {
            input: {
                main: 'index.html',
                'trello/index': 'trello/index.html',
                'trello/welcome': 'trello/welcome.html',
                'trello/auth': 'trello/auth.html',
                'trello/dashboard': 'trello/dashboard.html',
                'trello/settings': 'trello/settings.html',
                'trello/card-back': 'trello/card-back.html',
                'trello/contact-log': 'trello/contact-log.html',
                'trello/updates': 'trello/updates.html',
                'trello/feedback': 'trello/feedback.html',
                'trello/templates': 'trello/templates.html'
            },
            output: {

                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',


                manualChunks: {
                    'vendor': ['@vercel/analytics']
                }
            }
        }
    },

    server: {
        port: 3000,
        host: '0.0.0.0',
        cors: true,
        allowedHosts: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Content-Security-Policy': "frame-ancestors 'self' https://trello.com https://*.trello.com;",
            'ngrok-skip-browser-warning': 'true'
        }
    }
})
