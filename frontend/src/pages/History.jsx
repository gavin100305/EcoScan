import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
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

  // Export history to a professionally formatted PDF
  const exportHistory = () => {
    if (!history || history.length === 0) {
      alert('No history to export');
      return;
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Header
    doc.setFillColor(20, 184, 166); // teal-600
    doc.rect(0, 0, pageWidth, 80, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('EcoScan - Scan History', margin, 45);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, 62);
    
    y = 110;
    doc.setTextColor(0, 0, 0);

    history.forEach((item, idx) => {
      // Check if we need a new page
      if (y > pageHeight - 150) {
        doc.addPage();
        y = margin;
      }

      // Item number and product name (title)
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(20, 184, 166);
      const title = `${idx + 1}. ${item.productName || 'Unknown Product'}`;
      doc.text(title, margin, y);
      y += 20;

      // Date
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(107, 114, 128); // gray-500
      doc.text(formatDate(item.timestamp), margin, y);
      y += 18;

      // Separator line
      doc.setDrawColor(229, 231, 235); // gray-200
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 15;

      // Details section
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // Material
      doc.setFont(undefined, 'bold');
      doc.text('Material:', margin, y);
      doc.setFont(undefined, 'normal');
      const materialText = doc.splitTextToSize(item.materialType || '—', contentWidth - 80);
      doc.text(materialText, margin + 80, y);
      y += (materialText.length * 14) + 8;

      // Recyclability
      doc.setFont(undefined, 'bold');
      doc.text('Recyclability:', margin, y);
      doc.setFont(undefined, 'normal');
      const recyclabilityText = doc.splitTextToSize(item.recyclability || '—', contentWidth - 100);
      doc.text(recyclabilityText, margin + 100, y);
      y += (recyclabilityText.length * 14) + 8;

      // Carbon Footprint
      doc.setFont(undefined, 'bold');
      doc.text('Carbon Footprint:', margin, y);
      doc.setFont(undefined, 'normal');
      doc.text(item.carbonFootprint || '—', margin + 115, y);
      y += 20;

      // Disposal Method
      doc.setFont(undefined, 'bold');
      doc.text('Disposal:', margin, y);
      doc.setFont(undefined, 'normal');
      const disposalText = doc.splitTextToSize(item.disposalMethod || '—', contentWidth - 80);
      doc.text(disposalText, margin + 80, y);
      y += (disposalText.length * 14) + 8;

      // Alternatives (if available)
      if (item.alternativeSuggestions) {
        doc.setFont(undefined, 'bold');
        doc.text('Alternatives:', margin, y);
        y += 14;
        doc.setFont(undefined, 'normal');
        doc.setTextColor(55, 65, 81); // gray-700
        const altText = doc.splitTextToSize(item.alternativeSuggestions, contentWidth - 20);
        doc.text(altText, margin + 10, y);
        y += (altText.length * 14) + 8;
      }

      // Bottom border for item
      y += 10;
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(1);
      doc.line(margin, y, pageWidth - margin, y);
      y += 25;

      doc.setTextColor(0, 0, 0);
    });

    // Footer on last page
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175); // gray-400
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 50, pageHeight - 30);
      doc.text('Generated by EcoScan', margin, pageHeight - 30);
    }

    doc.save('ecoscan-history.pdf');
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
                onClick={() => exportHistory()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-card border border-border text-foreground hover:bg-muted/50 hover:border-teal-600/50 font-semibold rounded-lg transition-colors"
              >
                Export PDF
              </motion.button>
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
