import { fileURLToPath, URL } from "url"
import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"

const env = loadEnv("production", process.cwd(), "")
let build_source_map = true
if (env.VERCEL_ENV == "production") {
    build_source_map = false
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VueI18nPlugin({
            compositionOnly: true,
            fullInstall: false,
            defaultSFCLang: "json",
        }),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ['favicon.ico', 'android-chrome-192x192.png', 'android-chrome-512x512-maskable.png', 'android-chrome-512x512.png', 'icon.svg'],
            workbox: {
                cleanupOutdatedCaches: true,
                sourcemap: build_source_map,
                globPatterns: ["**/*.{woff2,html,js,css,png,webp,jpg,svg}"],
                globIgnores: ["og.png"],
            },
            manifest: {
                name: "streaming-list",
                short_name: "streaming-list",
                display: "standalone",
                theme_color: "#343a40",
                background_color: "#343a40",
                icons: [
                    {
                        src: "img/icons/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "img/icons/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "img/icons/android-chrome-512x512-maskable.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
        },
    },
    build: {
        manifest: false,
        minify: "esbuild",
        ssrManifest: false,
    },
    server: {
        host: "127.0.0.1",
        port: 3000,
    },
})
