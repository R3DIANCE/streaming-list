import { createApp } from "vue";
import App from "./App.vue";
import LazyLoadDirective from "./directives/LazyLoadDirective.js";
import { registerSW } from "virtual:pwa-register";
import * as VueI18n from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

window.addEventListener("load", () => {
    registerSW({ immediate: true });
});

const app = createApp(App);

app.directive("lazyload", LazyLoadDirective);

const i18n = VueI18n.createI18n({
    silentFallbackWarn: true,
    fallbackWarn: false,
    missingWarn: false,
    silentTranslationWarn: true,
    defaultSFCLang: "json",
    locale: window.navigator.language,
    fallbackLocale: "en",
    globalInjection: true,
    messages,
});

app.use(i18n);
app.mount("#app");
