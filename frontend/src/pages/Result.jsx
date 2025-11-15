import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Landing/Navigation';
import Footer from '../components/Landing/Footer';

export default function Result() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastScan');
    if (saved) setResult(JSON.parse(saved));
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <p className="text-center">No scan results found. Please scan a product first.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const getSustainabilityColor = (level) => {
    switch (level) {
      case 'High':
      case 'Highly Recyclable':
      case 'Low':
        return 'from-emerald-500 to-teal-500';
      case 'Medium':
      case 'Moderately Recyclable':
        return 'from-yellow-500 to-orange-500';
      case 'Minimal':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-cyan-500 to-teal-500';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Scan
          </motion.button>

          <div className="bg-card border border-border rounded-2xl shadow-xl mb-8 overflow-visible">
            <div className="border-b border-border p-8 overflow-visible">
              <div className="flex items-start justify-between gap-6 overflow-visible">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold">{result.productName}</h1>
                </div>

                {/* Image thumbnail with hover preview */}
                {result.image && (
                  <motion.div 
                    className="flex-shrink-0 cursor-pointer relative z-10"
                    whileHover={{ scale: 2.5, zIndex: 50 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "center" }}
                  >
                    <img 
                      src={result.image} 
                      alt={result.productName} 
                      className="w-24 h-24 object-cover rounded-lg border-2 border-border shadow-lg" 
                    />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Sustainability Analysis</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  className="bg-background border border-border rounded-lg p-6 transition-colors hover:border-teal-600/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-lg">Material Type</h3>
                  </div>
                  <p className="text-foreground/80 text-base">{result.material}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  className="bg-background border border-border rounded-lg p-6 transition-colors hover:border-teal-600/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-lg">Recyclability</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/80 text-base flex-1">{result.recyclability}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold text-foreground/80">✓ Yes</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  className="bg-background border border-border rounded-lg p-6 transition-colors hover:border-teal-600/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-lg">Carbon Footprint</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/80 text-base flex-1">{result.carbonFootprint}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold text-foreground/80">⬇ Good</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  className="bg-background border border-border rounded-lg p-6 transition-colors hover:border-teal-600/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-lg">Disposal Method</h3>
                  </div>
                  <p className="text-foreground/80 text-base">{result.disposalMethod}</p>
                </motion.div>
              </div>

              {result.alternativeSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                  whileTap={{ scale: 0.995 }}
                  className="bg-background border border-dashed border-teal-600/50 rounded-lg p-6 mb-6"
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Eco-Friendly Alternatives
                  </h3>
                  <p className="text-foreground/90 leading-relaxed">{result.alternativeSuggestions}</p>
                </motion.div>
              )}

              <div className="flex gap-4">
                <motion.button
                  onClick={() => (window.location.href = '/scan')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-teal-600/20"
                >
                  Scan Another Product
                </motion.button>
                <motion.button
                  onClick={() => (window.location.href = '/history')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-teal-600/20"
                >
                  View History
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
