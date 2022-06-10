import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import LazyLoadDirective from "./directives/LazyLoadDirective.js";
import { registerSW } from 'virtual:pwa-register';
import * as VueI18n from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

window.addEventListener('load', () => {
    registerSW({ immediate: true })
})

const app = createApp(App);

app.directive("lazyload", LazyLoadDirective);

const i18n = VueI18n.createI18n({
    defaultSFCLang: 'json',
    locale: window.navigator.language,
    fallbackLocale: 'en',
    globalInjection: true,
    messages,
})

app.use(i18n);
app.use(router);
app.mount("#app");
