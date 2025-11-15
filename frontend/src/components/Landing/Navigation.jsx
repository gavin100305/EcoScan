import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { PiPlantFill } from "react-icons/pi";
import { FiSun, FiMoon, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { userAPI } from '../../api';
import { supabase } from '../../lib/supabase';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const { isDark, toggleTheme, mounted } = useTheme();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await userAPI.deleteAccount();
        await supabase.auth.admin.deleteUser(user.id);
        await signOut();
        window.location.href = '/';
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (!mounted) return null;

  return (
    <nav className="max-w-5xl mx-2 md:mx-auto sticky top-4 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border rounded-full shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-sm">
                <PiPlantFill className="text-white text-xl" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                EcoScan
              </h1>
            </a>
          </div>

          {/* Centered Desktop Menu - Only show when logged in */}
          {user && (
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
              <a href="/scan" className="text-sm font-medium text-foreground/70 hover:text-teal-600 transition-colors">
                Scan
              </a>
              <a href="/history" className="text-sm font-medium text-foreground/70 hover:text-teal-600 transition-colors">
                History
              </a>
            </div>
          )}

          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-2 hover:bg-muted/50 rounded-lg"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isDark ? (
                    <FiSun className="h-5 w-5" />
                  ) : (
                    <FiMoon className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            
            {user ? (
              <div className="relative">
                <motion.button 
                  onClick={() => setActiveMenu(activeMenu === 'user' ? null : 'user')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {activeMenu === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ x: 5, backgroundColor: 'var(--muted)' }}
                        transition={{ duration: 0.2 }}
                        className="w-full px-4 py-3 text-left text-sm flex items-center gap-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </motion.button>
                      <motion.button
                        onClick={handleDeleteAccount}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 border-t border-border"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete Account
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a href="/login" className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-200">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </a>
            )}

            {/* Mobile Menu Button - Only when logged in */}
            {user && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-muted/50 rounded-lg transition-all duration-200"
              >
                {isOpen ? (
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only show when logged in */}
      <AnimatePresence>
        {isOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-card/95 backdrop-blur-lg border-t border-border/50 rounded-b-3xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <motion.a
                href="/scan"
                whileHover={{ x: 5 }}
                className="block px-4 py-2.5 text-foreground/70 hover:text-teal-600 hover:bg-muted/50 rounded-lg transition-colors"
              >
                Scan
              </motion.a>
              <motion.a
                href="/history"
                whileHover={{ x: 5 }}
                className="block px-4 py-2.5 text-foreground/70 hover:text-teal-600 hover:bg-muted/50 rounded-lg transition-colors"
              >
                History
              </motion.a>
              <motion.button
                onClick={handleLogout}
                whileHover={{ x: 5 }}
                className="w-full text-left px-4 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </motion.button>
              <motion.button
                onClick={handleDeleteAccount}
                whileHover={{ x: 5 }}
                className="w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
