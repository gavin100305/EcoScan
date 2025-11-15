import { useState } from 'react';
import { PiPlantFill } from "react-icons/pi";
import { FiShoppingCart, FiSun, FiMoon, FiLogIn } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme, mounted } = useTheme();
  const { user } = useAuth();

  if (!mounted) return null;

  const loggedIn = !!user;

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <nav className="max-w-5xl mx-2 md:mx-auto bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border rounded-full shadow-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
                  <PiPlantFill className="text-white text-xl" />
                </div>
                <span className="text-lg font-semibold text-foreground">EcoScan</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              {!loggedIn ? (
                <div className="flex items-center gap-2">
                  <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-muted/50">
                    {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                  </button>
                  <a href="/login" className="p-2 rounded-md hover:bg-muted/50">
                    <FiLogIn className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                <>
                  <div className="hidden md:flex items-center gap-6">
                    <a href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground">Home</a>
                    <a href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-foreground">Scan</a>
                    <a href="/history" className="text-sm font-medium text-foreground/70 hover:text-foreground">History</a>
                    <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground">About</a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-muted/50">
                      {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </button>

                    <button className="relative p-2 rounded-md hover:bg-muted/50" aria-label="Cart">
                      <FiShoppingCart className="w-5 h-5" />
                    </button>

                    <a href="/dashboard" className="p-2 rounded-md hover:bg-muted/50">
                      <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
