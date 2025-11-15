import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

import BlurText from '../ui/BlurText';

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section className="relative pt-28 pb-32 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
       

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="block">
            <BlurText
              as="span"
              text="Know Your"
              className="inline-block text-foreground"
              delay={120}
              animateBy="words"
              direction="top"
            />
          </span>
          <span className="block">
            <BlurText
              as="span"
              text={`Product's Environmental Impact`}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500"
              delay={140}
              animateBy="words"
              direction="top"
            />
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Simply scan a product image with your camera to instantly discover its sustainability attributes, material composition, and environmental footprint.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <motion.a
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Scan Now
            <motion.svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.a>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary/10 transition-colors"
          >
            Learn More
          </motion.a>
        </motion.div>

        {/* Hero Image Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden bg-card border border-border shadow-2xl">
          <motion.img
            key={isDark ? 'dark' : 'light'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/dark_mode.png' : '/light_mode.png'}
            alt="Product Scan Preview"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
