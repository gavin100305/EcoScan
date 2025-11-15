import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import Navigation from '../components/Landing/Navigation';
import Footer from '../components/Landing/Footer';
import { useAuth } from '../contexts/AuthContext';
import { scanAPI } from '../api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      const data = await scanAPI.getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecyclingBadgeColor = (recyclability) => {
    const text = recyclability?.toLowerCase() || '';
    if (text.includes('highly') || text.includes('high')) {
      return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
    }
    if (text.includes('moderate') || text.includes('medium')) {
      return 'bg-teal-500/20 text-teal-700 dark:text-teal-300';
    }
    if (text.includes('minimal') || text.includes('low')) {
      return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
    }
    return 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300';
  };

  const getCarbonBadgeColor = (carbonFootprint) => {
    const text = carbonFootprint?.toLowerCase() || '';
    if (text.includes('very low') || text.includes('low')) {
      return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
    }
    if (text.includes('medium')) {
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
    }
    if (text.includes('high')) {
      return 'bg-red-500/20 text-red-700 dark:text-red-300';
    }
    return 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const viewDetails = (item) => {
    // include any available image path so Result can show a preview
    const image = item.imagePath || item.image || item.imageUrl || item.image_url || null;
    localStorage.setItem('lastScan', JSON.stringify({
      productName: item.productName,
      material: item.materialType,
      recyclability: item.recyclability,
      carbonFootprint: item.carbonFootprint || 'Medium',
      disposalMethod: item.disposalMethod || 'Recycling Bin',
      alternativeSuggestions: item.alternativeSuggestions || '',
      confidence: '95%',
      timestamp: item.timestamp,
      image,
    }));
    window.location.href = '/result';
  };

  const toggleSelection = (item) => {
    const itemData = {
      productName: item.productName,
      material: item.materialType,
      recyclability: item.recyclability,
      carbonFootprint: item.carbonFootprint || 'Medium',
      disposalMethod: item.disposalMethod || 'Recycling Bin',
      alternativeSuggestions: item.alternativeSuggestions || '',
      confidence: '95%',
      timestamp: item.timestamp,
    };

    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.productName === item.productName && i.timestamp === item.timestamp);
      if (isSelected) {
        return prev.filter(i => !(i.productName === item.productName && i.timestamp === item.timestamp));
      } else {
        if (prev.length >= 2) {
          return [prev[1], itemData];
        }
        return [...prev, itemData];
      }
    });
  };

  const handleCompare = () => {
    if (selectedItems.length === 2) {
      localStorage.setItem('compareResults', JSON.stringify(selectedItems));
      window.location.href = '/compare';
    }
  };

  const isSelected = (item) => {
    return selectedItems.some(i => i.productName === item.productName && i.timestamp === item.timestamp);
  };

  const handleDelete = async (e, scanId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this scan?')) {
      try {
        await scanAPI.deleteScan(scanId);
        setHistory(prev => prev.filter(item => item.id !== scanId));
      } catch (err) {
        console.error('Failed to delete scan:', err);
        alert('Failed to delete scan. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Scan History
              </h1>
              <p className="text-muted-foreground text-lg">
                All your previous product scans and sustainability analysis
              </p>
            </div>
            <div className="flex gap-3">
              {history.length > 0 && (
                <motion.button
                  onClick={() => {
                    setCompareMode(!compareMode);
                    setSelectedItems([]);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                    compareMode
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30'
                      : 'bg-card border border-border text-foreground hover:bg-muted/50 hover:border-teal-600/50'
                  }`}
                >
                  {compareMode ? 'Cancel Compare' : 'Compare Mode'}
                </motion.button>
              )}
              <motion.button
                onClick={() => window.location.href = '/scan'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-teal-600/30"
              >
                New Scan
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {compareMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Select 2 items to compare ({selectedItems.length}/2 selected)
                  </p>
                  {selectedItems.length === 2 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleCompare}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-teal-600/30"
                    >
                      Compare Selected
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {history.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold mb-2">No scans yet</h2>
              <p className="text-muted-foreground mb-6">
                Start scanning products to build your sustainability history
              </p>
              <button
                onClick={() => window.location.href = '/scan'}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                Scan Your First Product
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => compareMode ? toggleSelection(item) : viewDetails(item)}
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  className={`bg-card border rounded-lg p-6 transition-all cursor-pointer relative ${
                    compareMode && isSelected(item)
                      ? 'border-teal-600 bg-teal-600/5'
                      : 'border-border hover:border-teal-600/50'
                  }`}
                >
                  <motion.button
                    onClick={(e) => handleDelete(e, item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Delete scan"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </motion.button>
                  <div className="grid md:grid-cols-4 gap-4 items-center pr-12">
                    <div className="md:col-span-1">
                      <h3 className="font-semibold text-lg line-clamp-2">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{formatDate(item.timestamp)}</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-sm text-muted-foreground mb-1">Material</p>
                      <p className="font-medium line-clamp-2">{item.materialType}</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-sm text-muted-foreground mb-1">Recyclability</p>
                      <p className="font-medium">{item.recyclability}</p>
                    </div>

                    <div className="md:col-span-1 flex flex-col gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Carbon Footprint</p>
                        <p className="font-medium">{item.carbonFootprint || 'Medium'}</p>
                      </div>
                      {compareMode && isSelected(item) && (
                        <span className="text-teal-600 font-semibold text-sm animate-fade-in">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
