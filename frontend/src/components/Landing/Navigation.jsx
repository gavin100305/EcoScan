import { useState, useEffect } from 'react';
import { HiCube } from 'react-icons/hi';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const shouldBeDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  };

  if (!mounted) return null;

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto">
        <nav className="px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-sm">
            <HiCube className="text-white text-xl" />
          </div>
          <span className="font-semibold text-lg text-foreground">ScanEarth</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Home
          </a>
          <a href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Scan
          </a>
          <a href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            History
          </a>
          <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            About
          </a>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 001.414 0zM5 11a1 1 0 100-2H4a1 1 0 100 2h1zM3.172 3.172a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-200">
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <a href="/dashboard" className="p-2 hover:bg-muted/50 rounded-lg transition-all duration-200">
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </a>

          {/* Mobile Menu Button */}
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
        </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-lg border-b border-border/50">
          <div className="px-4 py-4 space-y-1">
            <a href="/" className="block px-4 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
              Home
            </a>
            <a href="/dashboard" className="block px-4 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
              Scan
            </a>
            <a href="/dashboard" className="block px-4 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
              History
            </a>
            <a href="#features" className="block px-4 py-2.5 text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all">
              About
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
