import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { registerSW } from 'virtual:pwa-register'

window.addEventListener('load', () => {
    registerSW({ immediate: true })
})

const app = createApp(App);

app.use(router);
app.mount("#app");
