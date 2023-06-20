import { createApp } from "vue"
import { createClient } from "villus"
import App from "./App.vue"
import LazyLoadDirective from "./directives/LazyLoadDirective.js"
import { registerSW } from "virtual:pwa-register"
import * as VueI18n from "vue-i18n"
import * as Sentry from "@sentry/vue";

window.addEventListener("load", () => {
    registerSW({ immediate: true })
})

const app = createApp(App)

Sentry.init({
    app,
    dsn: "https://e2caf30e811348dcb0a10a8f0b9580c5@o4505391383838720.ingest.sentry.io/4505391386001408",
});

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
