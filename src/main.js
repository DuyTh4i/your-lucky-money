import { createApp } from 'vue'
import App from './App.vue'
import TheModel from './components/TheModel.vue'

createApp(App).component('the-model',TheModel).mount('#app')
