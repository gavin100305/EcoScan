import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Landing/Navigation';
import Footer from '../components/Landing/Footer';
import { useAuth } from '../contexts/AuthContext';
import { scanAPI } from '../api';

export default function Scan() {
  const [mode, setMode] = useState('single'); // 'single' or 'compare'
  const [selectedImages, setSelectedImages] = useState([null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([null, null]);
  const fileInputRefs = [useRef(null), useRef(null)];
  const { user } = useAuth();

  const handleFileSelect = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      const newImages = [...selectedImages];
      const newPreviews = [...previewUrls];
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      setSelectedImages(newImages);
      setPreviewUrls(newPreviews);
      setError('');
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      const newImages = [...selectedImages];
      const newPreviews = [...previewUrls];
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      setSelectedImages(newImages);
      setPreviewUrls(newPreviews);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleScan = async () => {
    const imagesToScan = mode === 'compare' 
      ? selectedImages.filter(img => img !== null)
      : [selectedImages[0]].filter(img => img !== null);

    if (imagesToScan.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // Scan all images using API service
      const scanPromises = imagesToScan.map(image => 
        scanAPI.upload(image, user?.id)
      );

      const scanResults = await Promise.all(scanPromises);

      if (mode === 'compare') {
        localStorage.setItem('compareResults', JSON.stringify(scanResults));
        window.location.href = '/compare';
      } else {
        localStorage.setItem('lastScan', JSON.stringify(scanResults[0]));
        window.location.href = '/result';
      }
    } catch (err) {
      setError(err.message || 'Failed to scan product');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = (index) => {
    const newImages = [...selectedImages];
    const newPreviews = [...previewUrls];
    newImages[index] = null;
    newPreviews[index] = null;
    setSelectedImages(newImages);
    setPreviewUrls(newPreviews);
    setError('');
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = '';
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setSelectedImages([null, null]);
    setPreviewUrls([null, null]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Scan a Product
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload product images to discover their environmental impact
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => switchMode('single')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out transform hover:scale-105 ${
                mode === 'single'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'bg-card border border-border text-foreground/70 hover:text-foreground hover:border-teal-600/50'
              }`}
            >
              Single Scan
            </button>
            <button
              onClick={() => switchMode('compare')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out transform hover:scale-105 ${
                mode === 'compare'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'bg-card border border-border text-foreground/70 hover:text-foreground hover:border-teal-600/50'
              }`}
            >
              Compare Products
            </button>
          </div>

          <div className={`grid ${mode === 'compare' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {(mode === 'compare' ? [0, 1] : [0]).map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="p-8">
                  {mode === 'compare' && (
                    <h3 className="text-lg font-semibold mb-4 text-center transition-colors duration-300">
                      Product {index + 1}
                    </h3>
                  )}
                  
                  {!previewUrls[index] ? (
                    <motion.div
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRefs[index].current?.click()}
                      whileHover={{ borderColor: 'rgb(13 148 136 / 0.5)', backgroundColor: 'rgb(13 148 136 / 0.05)' }}
                      className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer transition-all"
                    >
                      <motion.svg
                        whileHover={{ scale: 1.1, color: 'rgb(13 148 136)' }}
                        className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </motion.svg>
                      <p className="text-lg font-medium mb-2">Drop image here or click</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG, WEBP (max 5MB)</p>
                      <input
                        ref={fileInputRefs[index]}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, index)}
                        className="hidden"
                      />
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                      >
                        <motion.img
                          whileHover={{ scale: 1.02 }}
                          src={previewUrls[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg border border-border"
                        />
                        <motion.button
                          onClick={() => clearImage(index)}
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 p-2 bg-teal-600/90 hover:bg-teal-700 text-white rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="mt-6 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg p-4 text-center">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <AnimatePresence>
            {(mode === 'single' ? previewUrls[0] : previewUrls.some(url => url !== null)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 flex gap-4 justify-center"
              >
                <motion.button
                  onClick={handleScan}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.svg
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </motion.svg>
                      Analyzing...
                    </span>
                  ) : (
                    mode === 'compare' ? 'Compare Products' : 'Scan Product'
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it Works Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-teal-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload Image</h3>
              <p className="text-sm text-muted-foreground">Take or upload a photo of your product</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-teal-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">Our AI identifies materials and sustainability</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-teal-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-sm text-muted-foreground">View detailed environmental impact report</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
