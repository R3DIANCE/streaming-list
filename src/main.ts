import { createApp } from "vue"
import { createClient } from "villus"
import App from "./App.vue"
import LazyLoadDirective from "./directives/LazyLoadDirective.js"
import { registerSW } from "virtual:pwa-register"
import * as VueI18n from "vue-i18n"

window.addEventListener("load", () => {
    registerSW({ immediate: true })
})

const app = createApp(App)

const client = createClient({
    url: "https://tts-de-gta5.nickwasused.com/graphql",
    cachePolicy: "cache-and-network",
})

const i18n = VueI18n.createI18n({
    legacy: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    missingWarn: true,
    silentTranslationWarn: true,
    defaultSFCLang: "json",
    locale: window.navigator.language,
    fallbackLocale: "en-US",
    globalInjection: false,
})

app.directive("lazyload", LazyLoadDirective)
app.use(client)
app.use(i18n)
app.mount("#app")
