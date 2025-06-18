import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Import Assets
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css'
import './assets/css/styles.css';
import './assets/css/responsive.css';
import './assets/css/normalize.css';
createRoot(document.getElementById('root')).render(
    <App />
)
