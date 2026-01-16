import { defineConfig } from 'vite'

export default defineConfig({
    // Configuração simples para JavaScript puro
    // Define o caminho base da aplicação (útil para deploy)
    base: process.env.VITE_BASE_PATH || '/trello-kpi'
})
