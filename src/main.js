import { createApp, provide, h } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import App from "./App.vue";
import LazyLoadDirective from "./directives/LazyLoadDirective.js";
import { registerSW } from "virtual:pwa-register";
import * as VueI18n from "vue-i18n";

window.addEventListener("load", () => {
    registerSW({ immediate: true });
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
    cache,
    uri: 'https://tts-de-gta5.nickwasused.com/graphql',
});

const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient);
    },

    render: () => h(App),
});

app.directive("lazyload", LazyLoadDirective);

const i18n = VueI18n.createI18n({
    legacy: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    missingWarn: true,
    silentTranslationWarn: true,
    defaultSFCLang: "json",
    locale: window.navigator.language,
    fallbackLocale: "en-US",
    globalInjection: false
});

app.use(i18n);
app.mount("#app");
