import "./assets/main.css"

import { createApp } from "vue"
import router from './router'
import App from "./App.vue"

const app = createApp(App)
app.use(router)
router.push("/task")
app.mount("#app")
