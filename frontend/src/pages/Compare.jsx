import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Landing/Navigation';
import Footer from '../components/Landing/Footer';
import { FiCheckCircle, FiAlertTriangle, FiTrendingDown, FiTrash2, FiRefreshCw } from 'react-icons/fi';

export default function Compare() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('compareResults');
    if (data) {
      setResults(JSON.parse(data));
    } else {
      window.location.href = '/scan';
    }
  }, []);

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const getRecyclabilityColor = (recyclability) => {
    const text = recyclability?.toLowerCase() || '';
    if (text.includes('highly') || text.includes('high')) {
      return 'text-teal-600';
    }
    if (text.includes('moderate') || text.includes('medium')) {
      return 'text-teal-600';
    }
    return 'text-teal-600';
  };

  const getBadgeColor = (recyclability) => {
    const text = recyclability?.toLowerCase() || '';
    if (text.includes('highly') || text.includes('high')) {
      return 'bg-teal-600/20 text-teal-700 dark:text-teal-300';
    }
    if (text.includes('moderate') || text.includes('medium')) {
      return 'bg-teal-600/20 text-teal-700 dark:text-teal-300';
    }
    return 'bg-teal-600/20 text-teal-700 dark:text-teal-300';
  };

  const getCarbonBadgeColor = (carbonFootprint) => {
    const text = carbonFootprint?.toLowerCase() || '';
    if (text.includes('very low') || text.includes('low')) {
      return 'bg-teal-600/20 text-teal-700 dark:text-teal-300';
    }
    if (text.includes('medium')) {
      return 'bg-teal-600/20 text-teal-700 dark:text-teal-300';
    }
    return 'bg-teal-600/20 text-teal-700 dark:text-teal-300';
  };

  const getBetterChoice = () => {
    // Simple comparison logic - can be enhanced
    const scores = results.map((result) => {
      let score = 0;
      const recyclability = result.recyclability?.toLowerCase() || '';
      const carbon = result.carbonFootprint?.toLowerCase() || '';
      
      if (recyclability.includes('highly') || recyclability.includes('high')) score += 3;
      else if (recyclability.includes('moderate') || recyclability.includes('medium')) score += 2;
      else score += 1;
      
      if (carbon.includes('very low') || carbon.includes('low')) score += 3;
      else if (carbon.includes('medium')) score += 2;
      else score += 1;
      
      return score;
    });
    
    if (scores[0] > scores[1]) return 0;
    if (scores[1] > scores[0]) return 1;
    return -1; // tie
  };

  const betterChoice = getBetterChoice();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
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

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Product Comparison
            </h1>
            <p className="text-muted-foreground text-lg">
              Compare the environmental impact of both products
            </p>
          </div>

          {/* Recommendation Banner */}
          {betterChoice !== -1 && (
            <div className="mb-8 bg-teal-500/10 border border-teal-500/30 rounded-lg p-6 text-center animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-teal-600">
                Better Environmental Choice
              </h2>
              <p className="text-muted-foreground">
                Based on recyclability and carbon footprint, <span className="font-semibold text-teal-600">Product {betterChoice + 1}</span> is the more sustainable option
              </p>
            </div>
          )}

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <div 
                key={index}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`bg-card border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:scale-[1.02] animate-fade-in ${
                  betterChoice === index ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-border'
                }`}
              >
                <div className="border-b border-border p-6 bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Product {index + 1}</h2>
                    {betterChoice === index && (
                      <span className="px-3 py-1 bg-teal-600 text-white text-sm font-semibold rounded-full">
                        Better Choice
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-teal-600">
                    {result.productName}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* Material */}
                  <div className="bg-background border border-border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-teal-600/30">
                    <div className="flex items-start gap-3">
                      <FiRefreshCw className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Material Composition</h4>
                        <p className="text-sm text-muted-foreground">{result.material}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recyclability */}
                  <div className="bg-background border border-border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-teal-600/30">
                    <div className="flex items-start gap-3">
                      <FiCheckCircle className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Recyclability</h4>
                        <p className="text-sm">{result.recyclability}</p>
                      </div>
                    </div>
                  </div>

                  {/* Carbon Footprint */}
                  <div className="bg-background border border-border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-teal-600/30">
                    <div className="flex items-start gap-3">
                      <FiTrendingDown className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Carbon Footprint</h4>
                        <p className="text-sm">{result.carbonFootprint}</p>
                      </div>
                    </div>
                  </div>

                  {/* Disposal Method */}
                  <div className="bg-background border border-border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-teal-600/30">
                    <div className="flex items-start gap-3">
                      <FiTrash2 className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Disposal Method</h4>
                        <p className="text-sm text-muted-foreground">{result.disposalMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <motion.button
              onClick={() => window.location.href = '/scan'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-teal-600/30"
            >
              Compare More Products
            </motion.button>
            <motion.button
              onClick={() => window.location.href = '/history'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-card border border-border hover:bg-muted/50 font-semibold rounded-lg transition-colors hover:border-teal-600/50"
            >
              View History
            </motion.button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
