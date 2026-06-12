import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { useTheme } from './composables/useTheme'

const app = createApp(App)
app.mount('#app')

// 确保主题在应用启动时就加载
useTheme()
