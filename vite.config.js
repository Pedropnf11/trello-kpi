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
