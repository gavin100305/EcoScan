import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { motion, useAnimation } from 'framer-motion'

function ThemeAnimator({ children }) {
  const { isDark } = useTheme();
  const controls = useAnimation();
  useEffect(() => {
    // subtle scale + fade to smooth the visual change while CSS variables transition
    controls.start({ opacity: [1, 0.97, 1], scale: [1, 0.995, 1], transition: { duration: 0.45, ease: 'easeInOut' } });
  }, [isDark]);

  return (
    <motion.div animate={controls} className="min-h-screen">
      {children}
    </motion.div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ThemeAnimator>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeAnimator>
    </ThemeProvider>
  </StrictMode>,
)
