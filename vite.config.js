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
                'trello/auth': 'trello/auth.html',
                'trello/dashboard': 'trello/dashboard.html',
                'trello/settings': 'trello/settings.html'
            },
            output: {

                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',


                manualChunks: {
                    'vendor': ['@vercel/analytics']
                }
            }
        }
    },

    server: {
        port: 3000,
        headers: {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff'
        }
    }
})
