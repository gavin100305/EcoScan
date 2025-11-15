import React from 'react';
import { motion } from 'framer-motion';
import { RiRecycleFill } from 'react-icons/ri';

// Inline SVG icons to avoid react-icons export issues
function MagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
      <circle cx="11" cy="11" r="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// use RiRecycleFill as the main recycle icon

function LeafIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.5" d="M3 12c4-6 10-8 18-9-1 8-3 14-9 18C7 21 5 16 3 12z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoltIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.5" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.5" d="M21 16V8l-9-5-9 5v8l9 5 9-5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.5" d="M8 21h8M12 17v4M4 4h16v4a4 4 0 01-4 4H8A4 4 0 014 8V4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Features() {
  const features = [
    {
      icon: MagIcon,
      title: 'Instant Recognition',
      description: 'AI-powered image recognition instantly identifies products and materials',
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-700 dark:text-gray-300'
    },
    {
      icon: RiRecycleFill,
      title: 'Recyclability Info',
      description: 'Learn exactly how and where to recycle or properly dispose of items',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: LeafIcon,
      title: 'Material Breakdown',
      description: 'See detailed composition showing all materials used in products',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: BoltIcon,
      title: 'Carbon Footprint',
      description: 'Understand the environmental cost of your purchasing decisions',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-500'
    },
    {
      icon: CubeIcon,
      title: 'Eco Alternatives',
      description: 'Discover sustainable and environmentally-friendly product alternatives',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-700 dark:text-amber-500'
    },
    {
      icon: TrophyIcon,
      title: 'Sustainability Score',
      description: 'Get comprehensive eco-ratings and detailed sustainability metrics',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-500'
    },
  ];

  return (
    <section id="features" className="py-16 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500">
              Smart Scanning
            </span>
            {' '}for Conscious Consumers
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make informed, environmentally-friendly purchasing decisions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* Top-left: Large card that spans 2 columns and 2 rows */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="md:col-span-2 md:row-span-2 p-8 bg-card rounded-2xl border border-border transition-all duration-300 flex flex-col justify-center">
            <div className={`w-14 h-14 ${features[0].iconBg} rounded-xl flex items-center justify-center mb-6`}>
              {React.createElement(features[0].icon, { className: `w-8 h-8 ${features[0].iconColor}` })}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 text-foreground">{features[0].title}</h3>
            <p className="text-muted-foreground text-base leading-relaxed">{features[0].description}</p>
          </motion.div>

          {/* Top-right stacked cards (two rows) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="p-6 bg-card rounded-2xl border border-border transition-all duration-300 h-full flex flex-col justify-center">
            <div className={`w-14 h-14 ${features[1].iconBg} rounded-xl flex items-center justify-center mb-4`}>
              {React.createElement(features[1].icon, { className: `w-7 h-7 ${features[1].iconColor}` })}
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">{features[1].title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{features[1].description}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="p-6 bg-card rounded-2xl border border-border transition-all duration-300 h-full flex flex-col justify-center">
            <div className={`w-14 h-14 ${features[2].iconBg} rounded-xl flex items-center justify-center mb-4`}>
              {React.createElement(features[2].icon, { className: `w-7 h-7 ${features[2].iconColor}` })}
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">{features[2].title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{features[2].description}</p>
          </motion.div>

          {/* Bottom row - three equal cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="p-6 bg-card rounded-2xl border border-border transition-all duration-300">
            <div className={`w-14 h-14 ${features[3].iconBg} rounded-xl flex items-center justify-center mb-4`}>
              {React.createElement(features[3].icon, { className: `w-7 h-7 ${features[3].iconColor}` })}
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">{features[3].title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{features[3].description}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="p-6 bg-card rounded-2xl border border-border transition-all duration-300">
            <div className={`w-14 h-14 ${features[4].iconBg} rounded-xl flex items-center justify-center mb-4`}>
              {React.createElement(features[4].icon, { className: `w-7 h-7 ${features[4].iconColor}` })}
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">{features[4].title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{features[4].description}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="p-6 bg-card rounded-2xl border border-border transition-all duration-300">
            <div className={`w-14 h-14 ${features[5].iconBg} rounded-xl flex items-center justify-center mb-4`}>
              {React.createElement(features[5].icon, { className: `w-7 h-7 ${features[5].iconColor}` })}
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">{features[5].title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{features[5].description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
